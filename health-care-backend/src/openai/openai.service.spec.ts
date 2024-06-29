import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiService } from './openai.service';
import { ConfigModule } from '@nestjs/config';
import { TreatmentRawDto } from '../treatment/dto/treatmentRawDto';

describe('OpenaiService', () => {
  let service: OpenaiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [OpenaiService],
    }).compile();

    service = module.get<OpenaiService>(OpenaiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('test schedule prompt', async () => {
    const instructions: string[] | null[] = [
      'Лизиноприл 10мг, 2 раза в день, Метформин 1000мг, 2 раза в день',
      'Мониторинг артериального давления 2 раза в неделю, Анализ крови на глюкозу 1 раз в месяц',
      'Легкие растяжки 2 раза в неделю, Прогулки на свежем воздухе 15 минут ежедневно',
    ];

    await service.schedules(instructions[2]);
  });

  it('test parse text to TreatmentRawDto', async () => {
    const raw = `
    ФИО Андреев Иван Сергеевич
    тел +77774561234
    пол М
    дата рождения 1968-05-14
    адрес г. Петропавловск, ул. Советская, д. 30, кв. 12
    жалобы Частые головокружения.
    мед история: Гипертоническая болезнь III стадии, сахарный диабет II типа.
    рекомендации:
    Лизиноприл 10мг, 2 раза в день, Метформин 1000мг, 2 раза в день
    Мониторинг артериального давления 2 раза в неделю, Анализ крови на глюкозу 1 раз в месяц
    Прогулки на свежем воздухе 15 минут ежедневно, Легкие растяжки 2 раза в неделю
`;
    // TreatmentRawDto
    await service.parseRawToTreatment(raw);
  }, 100000);

  it('join to text', async () => {
    const data = [
      {
        field: 'full_name',
        title: 'ФИО',
        value: 'Андреев Иван Сергеевич',
      },
      {
        field: 'phone',
        title: 'Телефон',
        value: '+77774561234',
      },
      {
        field: 'gender',
        title: 'Пол',
        value: 'М',
      },
      {
        field: 'birthday',
        title: 'Дата рождения',
        value: '1968-05-14',
      },
      {
        field: 'address',
        title: 'Адрес',
        value: 'г. Петропавловск, ул. Советская, д. 30, кв. 12',
      },
      {
        field: 'emergency_contact',
        title: 'Контактное лицо',
        value: 'Андреева Мария Ивановна',
      },
      {
        field: 'emergency_contact_phone',
        title: 'Телефон контактного лица',
        value: '+77773216543',
      },
      {
        field: 'last_visit_date',
        title: 'Дата последнего визита',
        value: '2023-04-01',
      },
      {
        field: 'special_notes',
        title: 'Особые замечания',
        value: 'Частые головокружения.',
      },
      {
        field: 'medical_history',
        title: 'Медицинская история',
        value: 'Гипертоническая болезнь III стадии, сахарный диабет II типа.',
      },
      {
        field: 'blood_pressure',
        title: 'Артериальное давление',
        value: '150/90',
      },
      {
        field: 'pulse',
        title: 'Пульс',
        value: '80',
      },
      {
        field: 'lab_results',
        title: 'Результаты лабораторных исследований',
        value: 'Холестерин: 6.8 ммоль/л, Глюкоза: 7.1 ммоль/л',
      },
      {
        field: 'patient_feedback',
        title: 'Обратная связь от пациента',
        value: 'Чувствую постоянную усталость.',
      },
      {
        field: 'activity_level',
        title: 'Уровень активности',
        value: 'Низкий',
      },
      {
        field: 'psychological_state',
        title: 'Психологическое состояние',
        value: 'Депрессия',
      },
      {
        field: 'lifestyle',
        title: 'Образ жизни',
        value: 'Сидячий образ жизни, нерегулярное питание.',
      },
      {
        field: 'treatment_adherence',
        title: 'Приверженность лечению',
        value: 'Низкая',
      },
      {
        field: 'medications_raw',
        title: 'Назначения',
        value:
          'Лизиноприл 10мг, 2 раза в день, Метформин 1000мг, 2 раза в день',
      },
      {
        field: 'procedures_raw',
        title: 'Процедуры',
        value:
          'Мониторинг артериального давления 2 раза в неделю, Анализ крови на глюкозу 1 раз в месяц',
      },
      {
        field: 'exercises_raw',
        title: 'Упражнения',
        value:
          'Прогулки на свежем воздухе 15 минут ежедневно, Легкие растяжки 2 раза в неделю',
      },
    ];
    console.log(data.map((it) => it.value).join('\n'));
    // await service.schedules(instructions[2]);
  });
});
