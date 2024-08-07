import { AbstractPrompt } from './abstract.prompt';

export class TreatmentRawTextParserPrompt extends AbstractPrompt {
  instruction: string | null;

  constructor(instruction: string | null) {
    super();
    if (!instruction || !instruction.trim()) {
      throw new Error('Empty requestContext');
    }
    this.instruction = instruction;
  }

  getUserMessage(): string {
    return `
  Ты помощник, который должен помочь разделить предоставленные данные на отдельные элементы. 
  Входные будут модержать данные о пациенте ФИО, контакты, дата рождения, установленный диагноз, образ жизни, схема медикаментрозного лечения, рекомендации к процедурам и упражнениям для лечения.

  Пример входных данных: \`
ФИО Фёдорова Наталья Викторовна
Телефон +77772345678
Дата рождения 1965-03-10
Одышка при физической активности.
Гипертоническая болезнь II стадии, хроническая сердечная недостаточность.
Малоподвижный образ жизни, нерегулярное питание.
Бисопролол 5мг, 1 раз в день утром, Аторвастатин 10мг, 1 раз в день вечером
Мониторинг артериального давления 1 раз в неделю, ЭКГ 1 раз в 6 месяцев
Прогулки на свежем воздухе 20 минут ежедневно, Легкая зарядка 2 раза в неделю
  \`

  Твоя задача разложить эти данные в массив объектов как в примере ниже и вернуть JSON:

  {data:   [
    {
      "field": "full_name",
      "title": "ФИО",
      "value": "Фёдорова Наталья Викторовна"
    },
    {
      "field": "phone",
      "title": "Телефон",
      "value": "+77772345678"
    },
    {
      "field": "gender",
      "title": "Пол",
      "value": "Ж"
    },
    {
      "field": "birthday",
      "title": "Дата рождения",
      "value": "1965-03-10"
    },
    {
      "field": "address",
      "title": "Адрес",
      "value": "г. Актау, ул. Мангилик Ел, д. 20, кв. 1"
    },
    {
      "field": "emergency_contact",
      "title": "Контактное лицо",
      "value": "Фёдоров Виктор Сергеевич"
    },
    {
      "field": "emergency_contact_phone",
      "title": "Телефон контактного лица",
      "value": "+77773214567"
    },
    {
      "field": "last_visit_date",
      "title": "Дата последнего визита",
      "value": "2023-03-25"
    },
    {
      "field": "special_notes",
      "title": "Особые замечания",
      "value": "Одышка при физической активности."
    },
    {
      "field": "medical_history",
      "title": "Медицинская история",
      "value": "Гипертоническая болезнь II стадии, хроническая сердечная недостаточность."
    },
    {
      "field": "blood_pressure",
      "title": "Артериальное давление",
      "value": "145/85"
    },
    {
      "field": "pulse",
      "title": "Пульс",
      "value": "74"
    },
    {
      "field": "lab_results",
      "title": "Результаты лабораторных исследований",
      "value": "Холестерин: 6.5 ммоль/л, Глюкоза: 5.9 ммоль/л"
    },
    {
      "field": "patient_feedback",
      "title": "Обратная связь от пациента",
      "value": "Чувствую усталость после небольшой физической нагрузки."
    },
    {
      "field": "activity_level",
      "title": "Уровень активности",
      "value": "Низкий"
    },
    {
      "field": "psychological_state",
      "title": "Психологическое состояние",
      "value": "Стресс"
    },
    {
      "field": "lifestyle",
      "title": "Образ жизни",
      "value": "Малоподвижный образ жизни, нерегулярное питание."
    },
    {
      "field": "treatment_adherence",
      "title": "Приверженность лечению",
      "value": "Средняя"
    },
    {
      "field": "medications_raw",
      "title": "Назначения",
      "value": "Бисопролол 5мг, 1 раз в день утром, Аторвастатин 10мг, 1 раз в день вечером"
    },
    {
      "field": "procedures_raw",
      "title": "Процедуры",
      "value": "Мониторинг артериального давления 1 раз в неделю, ЭКГ 1 раз в 6 месяцев"
    },
    {
      "field": "exercises_raw",
      "title": "Упражнения",
      "value": "Прогулки на свежем воздухе 20 минут ежедневно, Легкая зарядка 2 раза в неделю"
    },
    {
      "field": "doctor_phone",
      "title": "Контакты лечащего врача",
      "value": "+77770123456"
    },
    {
      "field": "clinic_uin",
      "title": "БИН бизнес идентификацонный номер мед клиники 12 цифр",
      "value": "820228399094"
    }
  ]}
  Если какие то поля для выходных данных не нашел, то оставь их пустыми.
  
  Теперь сделай тоже самое со следующими данными:
  \` ${this.instruction}\`
  `;
  }

  getAssistantMessage(): string {
    return null;
  }
}
