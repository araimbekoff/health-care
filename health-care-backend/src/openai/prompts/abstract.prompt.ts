import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import OpenAI from 'openai';
import ChatCompletion = OpenAI.ChatCompletion;

export abstract class AbstractPrompt {
  getModel() {
    return 'gpt-3.5-turbo-0125';
  }

  getTemperature() {
    return 0.5;
  }

  abstract getAssistantMessage(): string;

  abstract getUserMessage(): string;

  getResponse(openaiResponse: ChatCompletion) {
    const { choices } = openaiResponse;
    if (!choices || !choices.length) {
      return null;
    }
    return JSON.parse(choices[0]?.message?.content);
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
