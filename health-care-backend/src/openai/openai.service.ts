import { Injectable } from '@nestjs/common';
import { AbstractPrompt } from './prompts/abstract.prompt';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { SchedulePrompt } from './prompts/schedule.prompt';
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
