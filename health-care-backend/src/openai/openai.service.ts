import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { SchedulePrompt } from './prompts/schedule.prompt';
import { InstructionParserPrompt } from './prompts/instruction.parser.prompt';
import { TreatmentRawTextParserPrompt } from './prompts/treatment-raw-text.parser.prompt';
import { TreatmentRawDto } from '../treatment/dto/treatmentRawDto';
import { AbstractPrompt } from './prompts/abstract.prompt';
import { DoctorParserPrompt } from './prompts/doctor.parser.prompt';

export class OpenaiScheduleResponse {
  instruction: string;
  schedules: string[];
}

export class DoctorInfoDto {
  full_name: string;
  phone: string;
  clinic_uin: string;
}

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_KEY'),
    });
  }

  async parseRawToTreatment(
    treatmentRawText: string,
  ): Promise<TreatmentRawDto> {
    const prompt = new TreatmentRawTextParserPrompt(treatmentRawText);
    return this.request<TreatmentRawDto>(prompt);
  }

  async schedules(instruction: string): Promise<OpenaiScheduleResponse[]> {
    const parserPrompt = new InstructionParserPrompt(instruction);
    const dataItems = await this.request<{ data: string[] }>(parserPrompt);
    return Promise.all(
      dataItems.data.map(async (instruction) => {
        const schedulePrompt = new SchedulePrompt(instruction);
        const res = await this.request<{ data: string[] }>(schedulePrompt);
        return { instruction, schedules: res.data };
      }),
    );
  }

  private async request<T>(prompt: AbstractPrompt): Promise<T> {
    const response = await this.openai.chat.completions.create(
      prompt.getBody() as any,
    );
    return prompt.getResponse(response) as T;
  }

  async parseDoctorInfo(doctor_info: string): Promise<DoctorInfoDto> {
    const prompt = new DoctorParserPrompt(doctor_info);
    const parsed_data = await this.request<{
      data: {
        full_name: string;
        phone: string;
        clinic_uin: string;
      };
    }>(prompt);
    return parsed_data?.data;
  }
}
