import { Test, TestingModule } from '@nestjs/testing';
import { TreatmentService } from './treatment.service';
import { ConfigModule } from '@nestjs/config';
import { DbCoreModule } from '../db-core/db-core.module';
import { TreatmentRawDto } from './dto/treatmentRawDto';
import { TreatmentType } from '../entities/treatment.entity';
import { IdManagerModule } from '../id-manager/id-manager.module';

describe('TreatmentService', () => {
  let service: TreatmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DbCoreModule, IdManagerModule],
      providers: [TreatmentService],
    }).compile();

    service = module.get<TreatmentService>(TreatmentService);
  });

  it('treatment save', async () => {
    const data = [
      {
        field: 'full_name',
        title: 'ФИО',
        value: 'Фёдорова Наталья Викторовна',
      },
      {
        field: 'phone',
        title: 'Телефон',
        value: '+77772345678',
      },
      {
        field: 'gender',
        title: 'Пол',
        value: 'Ж',
      },
      {
        field: 'birthday',
        title: 'Дата рождения',
        value: '1965-03-10',
      },
      {
        field: 'address',
        title: 'Адрес',
        value: 'г. Актау, ул. Мангилик Ел, д. 20, кв. 1',
      },
      {
        field: 'emergency_contact',
        title: 'Контактное лицо',
        value: 'Фёдоров Виктор Сергеевич',
      },
      {
        field: 'emergency_contact_phone',
        title: 'Телефон контактного лица',
        value: '+77773214567',
      },
      {
        field: 'last_visit_date',
        title: 'Дата последнего визита',
        value: '2023-03-25',
      },
      {
        field: 'special_notes',
        title: 'Особые замечания',
        value: 'Одышка при физической активности.',
      },
      {
        field: 'medical_history',
        title: 'Медицинская история',
        value:
          'Гипертоническая болезнь II стадии, хроническая сердечная недостаточность.',
      },
      {
        field: 'blood_pressure',
        title: 'Артериальное давление',
        value: '145/85',
      },
      {
        field: 'pulse',
        title: 'Пульс',
        value: '74',
      },
      {
        field: 'lab_results',
        title: 'Результаты лабораторных исследований',
        value: 'Холестерин: 6.5 ммоль/л, Глюкоза: 5.9 ммоль/л',
      },
      {
        field: 'patient_feedback',
        title: 'Обратная связь от пациента',
        value: 'Чувствую усталость после небольшой физической нагрузки.',
      },
      {
        field: 'activity_level',
        title: 'Уровень активности',
        value: 'Низкий',
      },
      {
        field: 'psychological_state',
        title: 'Психологическое состояние',
        value: 'Стресс',
      },
      {
        field: 'lifestyle',
        title: 'Образ жизни',
        value: 'Малоподвижный образ жизни, нерегулярное питание.',
      },
      {
        field: 'treatment_adherence',
        title: 'Приверженность лечению',
        value: 'Средняя',
      },
      {
        field: 'medications_raw',
        title: 'Назначения',
        value:
          'Бисопролол 5мг, 1 раз в день утром, Аторвастатин 10мг, 1 раз в день вечером',
      },
      {
        field: 'procedures_raw',
        title: 'Процедуры',
        value:
          'Мониторинг артериального давления 1 раз в неделю, ЭКГ 1 раз в 6 месяцев',
      },
      {
        field: 'exercises_raw',
        title: 'Упражнения',
        value:
          'Прогулки на свежем воздухе 20 минут ежедневно, Легкая зарядка 2 раза в неделю',
      },
    ];
    const dto: TreatmentRawDto = {
      data,
    };
    await service.save(dto, TreatmentType.AG);
  });
});