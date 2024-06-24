import { Injectable } from '@nestjs/common';
import { AbstractPrompt } from './prompts/abstract.prompt';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { SchedulePrompt } from './prompts/schedule.prompt';
import { InstructionParserPrompt } from './prompts/instruction.parser.prompt';
import { TreatmentRawTextParserPrompt } from './prompts/treatment-raw-text.parser.prompt';
import { TreatmentRawDto } from '../treatment/dto/treatmentRawDto';

export class OpenaiScheduleResponse {
  instruction: string;
  schedules: string[];
}

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_KEY'),
    });
  }

  async request<T>(prompt: AbstractPrompt) {
    const response = await this.openai.chat.completions.create({
      model: prompt.getModel(),
      messages: prompt.getBody().messages,
      temperature: prompt.getTemperature(),
      response_format: {
        type: 'json_object',
      },
    });
    return prompt.getResponse(response) as T;
  }

  async parseRawToTreatment(treatment_raw_text: string) {
    const prompt = new TreatmentRawTextParserPrompt(treatment_raw_text);
    return await this.request<TreatmentRawDto>(prompt);
  }

  async schedules(instruction: string): Promise<OpenaiScheduleResponse[]> {
    const parserPrompt = new InstructionParserPrompt(instruction);
    const dataItems = await this.request<{ data: string[] }>(parserPrompt);
    const schedules_list: OpenaiScheduleResponse[] = [];
    for (const instruction of dataItems.data) {
      const schedulePrompt = new SchedulePrompt(instruction);
      const res = await this.request<{ data: string[] }>(schedulePrompt);
      schedules_list.push({
        instruction,
        schedules: res.data,
      });
      console.log({
        instruction,
        schedules: res.data,
      });
    }
    return schedules_list;
  }
}
