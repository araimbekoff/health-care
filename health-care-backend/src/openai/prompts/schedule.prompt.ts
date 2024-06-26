import { AbstractPrompt } from './abstract.prompt';

export class SchedulePrompt extends AbstractPrompt {
  instruction: string | null;

  constructor(instruction: string | null) {
    super();
    if (!instruction || !instruction.trim()) {
      throw new Error('Empty requestContext');
    }
    this.instruction = instruction;
  }

  getUserMessage(): string {
    const element = this.instruction;
    return `
  Ты помощник, который должен составить расписание для пациента на основании предоставленного элемента. 
  Необходимо разложить данные в таблицу расписания на 30 дней вперед. 
  Расписание должно начинаться с текущей даты запроса плюс один день и быть детализировано по дням.

  Пример входных данных: \`Лизиноприл 10мг, 2 раза в день\`

  Твоя задача: 

  1. Разложить элемент на ежедневные записи на 30 дней вперед.
  2. Дата начала расписания должна быть ${new Date().toLocaleDateString()} + один день.
  3. Учитывай частоту и время выполнения процедур и приема лекарств. Например:
     - "1 раз в день утром" означает добавление записи каждый день в 8:00 утра.
     - "2 раза в день" означает добавление двух записей каждый день, например, в 8:00 и 20:00.
     - "3 раза в неделю" означает добавление трех записей в неделю, например, в понедельник, среду и пятницу в 9:00.
     - "1 раз в неделю" означает добавление записи раз в 7 дней в 9:00.
     - "2 раза в неделю" означает добавление двух записей в неделю, например, во вторник и четверг в 9:00.
     - "2 раза в месяц" означает добавление записи раз в 15 дней в 10:00.
     - "каждый час" означает добавление записи каждый час в течение дня, начиная с 9:00 и заканчивая 21:00.
  4. Результат должен быть в виде массива datetime:

  Пример результата в формате JSON:

  {data:["2024-06-20T08:00", 
   "2024-06-20T20:00", 
   "2024-06-21T08:00", 
   "2024-06-21T20:00", 
   "2024-06-22T08:00", 
   "2024-06-22T20:00", 
      ...
  ]}

  Ниже представлены входные данные:
  '${element}'
  
  Теперь разложи входные данные от даты ${new Date().toLocaleDateString()} + 1 день. Расписание должно быть рассчитано на 30 дней вперед.
  `;
  }

  getAssistantMessage(): string {
    return null;
  }
}
