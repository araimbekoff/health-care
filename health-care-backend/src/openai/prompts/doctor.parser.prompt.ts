import { AbstractPrompt } from './abstract.prompt';

export class DoctorParserPrompt extends AbstractPrompt {
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
ты крутой парсер. 
тебе придет запрос в виде текста. 
тебе надо распарсить и разложить данные в json со структурой
{
  data: {
    full_name: "Обазательно хотя бы имя и фамилия. Если нет подходяшего варианта, то верни в это поле null",
    phone: "Обязталельно в формате +77788888126 или 87788888126 или +7 778 888 81 26. должно быть код страны (+7 или 8), код оператора (3 цифры) и номер телефона (7 цифр). Если не подходит, то верни в это поле null",
    clinic_uin: "Обязательно 12 цифр. если не 12 цифр, то верни в это поле null"
  }
}


пример-1:  """Бин 212445678912
Телефон +777i3274699
ФИО Жульен Монтерей"""

результат для примера-1:
\`\`\`
{
  data: {
    full_name: Жульен Монтерей,
    phone: +777i3274699,
    clinic_uin: 212445678912
  }
}
\`\`\`

пример-2:  """
012345678912
8 771 999 81 00
Иванов Прометей"""

результат для примера-2:
\`\`\`
{
  data: {
    "full_name": "Иванов Прометей",
    "phone": "87719998100", // убрал все пробелы.
    "clinic_uin": "012345678912"
  }
}
\`\`\`

пример-3:  """
01234567891
8 747 199 13 000
Иванов Прометей"""

результат для примера-2:
\`\`\`
{
  data: {
    full_name: Иванов Прометей,
    phone: null,
    clinic_uin: null
  }
}
\`\`\`

ВАЖНО!!!
Если телефон начинается на 8, то замени ее на +7

#### input data
а теперь разложи текст ниже:
"${request}"
  `;
  }

  getAssistantMessage(): string {
    return null;
  }
}
