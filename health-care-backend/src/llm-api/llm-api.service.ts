import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs/promises';
import * as path from 'path';
import OpenAI from 'openai';
import { AbstractPrompt } from '../openai/prompts/abstract.prompt';

export type PromptJsonType =
  | 'medical-info-extraction-prompt.json'
  | 'medical-info-extraction-result-checker.json'
  | 'schedule-prompt.json'
  | 'schedule-prompt-checker.json';

export type LlmType = 'anthropic' | 'openai';

@Injectable()
export class LlmApiService {
  private anthropic: Anthropic;
  private openai: OpenAI;
  private readonly prompt_dir: string;
  private readonly logger = new Logger(LlmApiService.name);

  constructor(private readonly configService: ConfigService) {
    this.prompt_dir = this.configService.get<string>(
      'PROMPT_JSON_COLLECTION_DIR',
    );
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_KEY'),
    });
    this.anthropic = new Anthropic({
      apiKey: this.configService.get<string>('ANTHROPIC_API_KEY'),
    });
  }

  async generate(prompt: string, llmType: LlmType): Promise<string> {
    if (llmType === 'openai') {
      return await this.generateOpenai(prompt);
    } else if (llmType === 'anthropic') {
      return await this.generateAnthropic(prompt);
    }
    throw new Error('Unable LLM api');
  }

  async generateOpenai(prompt: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o-mini',
      temperature: 0.47,
      response_format: {
        type: 'json_object',
      },
    });
    if ('choices' in response) {
      const { choices } = response;
      if (!choices) {
        return null;
      }
      return choices[0]?.message?.content;
    }
    throw new Error('Empty response by openai');
  }

  async generateAnthropic(prompt: string): Promise<string> {
    try {
      const message = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      });

      if (Array.isArray(message.content) && message.content.length > 0) {
        const firstContent = message.content[0];
        if ('text' in firstContent && typeof firstContent.text === 'string') {
          return firstContent.text;
        }
      }
      throw new Error('Unexpected response structure from Anthropic API');
    } catch (error) {
      this.logger.error(`Error generating response: ${error.message}`);
      throw new Error('Failed to generate response from Anthropic API');
    }
  }

  async loadPrompt(
    prompt_type: PromptJsonType,
    prompt_params: Record<string, string>,
  ): Promise<string> {
    const not_exists_params = [];
    prompt_params['today'] = new Date().toLocaleDateString();
    try {
      const promptPath = path.join(this.prompt_dir, prompt_type);
      const promptTemplate = await fs.readFile(promptPath, 'utf-8');
      const promptJson = JSON.parse(promptTemplate) as Record<string, any>;
      const params = Object.keys(promptJson).filter(
        (key) => promptJson[key] === '%',
      );
      if (!params.length) {
        throw new Error('Загруженный промт не имеет параметров');
      }
      for (const param of params) {
        if (!prompt_params[param]) {
          not_exists_params.push(param);
          continue;
        }
        promptJson[param] = prompt_params[param];
      }
      if (!not_exists_params.length) {
        return JSON.stringify(promptJson);
      }
    } catch (error) {
      this.logger.error(`Error loading prompt: ${error.message}`);
      throw new Error(`Failed to load prompt: ${prompt_type}`);
    }
    throw new Error(
      `missing required params ${JSON.stringify(not_exists_params)}`,
    );
  }
}
