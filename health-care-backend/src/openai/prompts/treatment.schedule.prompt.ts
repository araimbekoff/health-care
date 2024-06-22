import { AbstractPrompt } from './abstract.prompt';

export class TreatmentSchedulePrompt extends AbstractPrompt {
  readonly requestContext: string;

  medications_raw: string | null;
  procedures_raw: string | null;
  exercises_raw: string | null;

  constructor(
    medications_raw: string | null,
    procedures_raw: string | null,
    exercises_raw: string | null,
  ) {
    super();
    if (!medications_raw && !procedures_raw && !exercises_raw) {
      throw new Error('Empty requestContext');
    }
    this.medications_raw = medications_raw
      ? `    {
        "field": "medications_raw",
        "title": "Назначения",
        "value": "${medications_raw}"
    },
`
      : '';
    this.procedures_raw = procedures_raw
      ? `    {
        "field": "procedures_raw",
        "title": "Процедуры",
        "value": "procedures_raw"
    },
`
      : '';
    this.exercises_raw = exercises_raw
      ? `    {
        "field": "exercises_raw",
        "title": "Упражнения",
        "value": "${exercises_raw}"
    }
`
      : '';
  }

  getUserMessage(): string {
    const request = `[${this.medications_raw}${this.procedures_raw}${this.exercises_raw}]`;
    return `
  Ты помощник, который должен составить расписание для пациента на основании данных, предоставленных в JSON формате. Необходимо разложить данные из полей \`medications_raw\`, \`procedures_raw\` и \`exercises_raw\` в таблицу расписания на 30 дней вперед. Расписание должно начинаться с текущей даты запроса плюс один день и быть детализировано по дням.

  Пример входных данных в формате JSON:

  [
      {
          "field": "medications_raw",
          "title": "Назначения",
          "value": "Лизиноприл 10мг, 2 раза в день, Метформин 1000мг, 2 раза в день"
      },
      {
          "field": "procedures_raw",
          "title": "Процедуры",
          "value": "Мониторинг артериального давления 2 раза в неделю, Анализ крови на глюкозу 1 раз в месяц"
      },
      {
          "field": "exercises_raw",
          "title": "Упражнения",
          "value": "Прогулки на свежем воздухе 15 минут ежедневно, Легкие растяжки 2 раза в неделю"
      }
  ]

  Твоя задача: 

  1. Разложить каждый элемент из \`medications_raw\`, \`procedures_raw\` и \`exercises_raw\` на ежедневные записи на 30 дней вперед.
  2. Дата начала расписания должна быть ${new Date().toLocaleDateString()} + один день.
  3. Учитывай частоту и время выполнения процедур и приема лекарств. Например:
     - "1 раз в день утром" означает добавление записи каждый день в течение 30 дней в 8:00 утра.
     - "2 раза в день" означает добавление двух записей каждый день в течение 30 дней, например, в 8:00 и 20:00.
     - "1 раз в неделю" означает добавление записи раз в 7 дней в 9:00.
     - "2 раза в месяц" означает добавление записи раз в 15 дней в 10:00.
     - "3 раза в неделю" означает добавление записи каждые 2-3 дня в 18:00.
     - "каждый час" означает добавление записи каждый час в течение дня, начиная с 9:00 и заканчивая 21:00.
  4. Результат должен быть структурирован в виде двумерного массива с первой строкой, содержащей заголовки полей:
     - \`date\`: дата выполнения.
     - \`time\`: время выполнения.
     - \`type\`: тип (medication/procedure/exercise).
     - \`description\`: описание задачи.

  Пример результата в формате JSON:

  [
      ["date", "time", "type", "description"],
      ["2024-06-20", "08:00", "medication", "Лизиноприл 10мг, 2 раза в день"],
      ["2024-06-20", "20:00", "medication", "Лизиноприл 10мг, 2 раза в день"],
      ["2024-06-20", "08:00", "medication", "Метформин 1000мг, 2 раза в день"],
      ["2024-06-20", "20:00", "medication", "Метформин 1000мг, 2 раза в день"],
      ["2024-06-20", "09:00", "exercise", "Прогулки на свежем воздухе 15 минут ежедневно"],
      ["2024-06-20", "09:00", "exercise", "Легкие растяжки 2 раза в неделю"],
      ...
  ]

  Теперь разложи данные из этого JSON в расписание на 30 дней вперед от даты ${new Date().toLocaleDateString()} + 1 день:

  ${request}
  `;
  }

  getAssistantMessage(): string {
    return null;
  }
}
