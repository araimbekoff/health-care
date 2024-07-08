import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import OpenAI from 'openai';
import ChatCompletion = OpenAI.ChatCompletion;
import {
  ChatCompletionChunk,
  ChatCompletionCreateParamsBase,
} from 'openai/src/resources/chat/completions';
import { APIPromise } from 'openai/src/core';
import { Stream } from 'openai/src/streaming';

export abstract class AbstractPrompt {
  getModel() {
    return 'gpt-3.5-turbo-0125';
  }

  getTemperature() {
    return 0.5;
  }

  abstract getAssistantMessage(): string;

  abstract getUserMessage(): string;

  // getResponse(openaiResponse: ChatCompletion) {
  getResponse(openaiResponse: OpenAI.Chat.Completions.ChatCompletion) {
    if ('choices' in openaiResponse) {
      const { choices } = openaiResponse;
      if (!choices) {
        return null;
      }
      return JSON.parse(choices[0]?.message?.content);
    }
    return null;
  }

  getBody() {
    const messages: ChatCompletionMessageParam[] = [
      { role: 'user', content: this.getUserMessage() },
    ];
    if (this.getAssistantMessage()) {
      messages.push({ role: 'assistant', content: this.getAssistantMessage() });
    }
    return {
      messages,
      model: this.getModel(),
      temperature: this.getTemperature(),
      response_format: {
        type: 'json_object',
      },
    };
  }
}
