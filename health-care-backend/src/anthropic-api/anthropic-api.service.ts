import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs/promises';
import * as path from 'path';

export type PromptType =
  | 'medical-info-extraction-prompt.md'
  | 'medical-info-extraction-prompt-checker.md'
  | 'schedule-prompt.md'
  | 'schedule-prompt-checker.md';

@Injectable()
export class AnthropicApiService {
  private anthropic: Anthropic;
  private readonly prompt_dir: string;
  private readonly logger = new Logger(AnthropicApiService.name);

  constructor(private readonly configService: ConfigService) {
    this.prompt_dir = this.configService.get<string>('PROMPT_COLLECTION_DIR');
    this.anthropic = new Anthropic({
      apiKey: this.configService.get<string>('ANTHROPIC_API_KEY'),
    });
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const message = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 3000,
        messages: [{ role: 'user', content: prompt }],
      });

      // Проверяем, что content существует и является массивом
      if (Array.isArray(message.content) && message.content.length > 0) {
        const firstContent = message.content[0];
        // Проверяем, что у firstContent есть свойство text
        if ('text' in firstContent && typeof firstContent.text === 'string') {
          return firstContent.text;
        }
      }

      // Если структура ответа не соответствует ожидаемой, выбрасываем ошибку
      throw new Error('Unexpected response structure from Anthropic API');
    } catch (error) {
      this.logger.error(`Error generating response: ${error.message}`);
      throw new Error('Failed to generate response from Anthropic API');
    }
  }

  async loadPrompt(
    prompt_type: PromptType,
    prompt_params: Record<string, string>,
  ): Promise<string> {
    const not_exists_params = [];
    try {
      const promptPath = path.join(this.prompt_dir, prompt_type);
      let promptTemplate = await fs.readFile(promptPath, 'utf-8');
      const params = this.extractPromptParams(promptTemplate);
      for (const param of params) {
        if (!prompt_params[param]) {
          not_exists_params.push(param);
          continue;
        }
        promptTemplate = promptTemplate.replace(param, prompt_params[param]);
      }
      if (!not_exists_params.length) {
        return promptTemplate;
      }
    } catch (error) {
      this.logger.error(`Error loading prompt: ${error.message}`);
      throw new Error(`Failed to load prompt: ${prompt_type}`);
    }
    throw new Error(
      `missing required params ${JSON.stringify(not_exists_params)}`,
    );
  }

  async complete(
    // raw_medicine_description: string,
    prompt_params: Record<string, string>,
    prompt_type: PromptType,
  ): Promise<string> {
    try {
      const prompt = await this.loadPrompt(prompt_type, prompt_params);
      return await this.generateResponse(prompt);
    } catch (error) {
      this.logger.error(`Error completing prompt: ${error.message}`);
      throw new Error('Failed to complete prompt');
    }
  }

  private extractPromptParams(text: string) {
    const matches = text.match(/%([^%]+)%/g);
    if (matches) {
      const result = matches.map((match) => match.replace(/%/g, ''));
      console.log(result);
      return result;
    } else {
      throw new Error("Prompt doesn't have params");
    }
  }
}
