import { AbstractPrompt } from './abstract.prompt';

export class ParserPrompt extends AbstractPrompt {
  instruction: string | null;

  constructor(instruction: string | null) {
    super();
    if (!instruction || !instruction.trim()) {
      throw new Error('Empty requestContext');
    }
    this.instruction = instruction;
  }

  getUserMessage(): string {
    const request = `[${this.instruction}]`;

    return `
  Ты помощник, который должен помочь разделить предоставленные данные на отдельные элементы. Входные данные могут быть либо рецептом, либо процедурой, либо упражнением. Твоя задача состоит в том, чтобы извлечь и разделить каждое задание на отдельные элементы.

  Пример входных данных: \`Лизиноприл 10мг, 2 раза в день, Метформин 1000мг, 2 раза в день\`

  Пример результата в формате JSON в виде массива:

  {data:[
    "Лизиноприл 10мг, 2 раза в день",
    "Метформин 1000мг, 2 раза в день"
  ]}
  Теперь раздели данные на отдельные элементы:

  ${request}
  `;
  }

  getAssistantMessage(): string {
    return null;
  }
}
