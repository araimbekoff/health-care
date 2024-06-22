import { Injectable } from '@nestjs/common';
import { TreatmentSchedulePrompt } from './prompts/treatment.schedule.prompt';
import { AbstractPrompt } from './prompts/abstract.prompt';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { SchedulePrompt } from './prompts/schedule.prompt';
import * as inspector from 'node:inspector';
import { ParserPrompt } from './prompts/parser.prompt';

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

  async schedulesBatch(
    medications_raw: string,
    procedures_raw: string,
    exercises_raw: string,
  ) {
    const schedulePrompt = new TreatmentSchedulePrompt(
      medications_raw,
      procedures_raw,
      exercises_raw,
    );
    const res = await this.request(schedulePrompt);
    console.log(res);
  }

  async schedules(instruction: string) {
    const parserPrompt = new ParserPrompt(instruction);
    const dataItems = await this.request<{ data: string[] }>(parserPrompt);
    console.log(dataItems);
    for (const item of dataItems.data) {
      const schedulePrompt = new SchedulePrompt(item);
      const res = await this.request(schedulePrompt);
      console.log(res);
    }
  }
}
