import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleGeneratorService } from './schedule-generator.service';
import { ConfigModule } from '@nestjs/config';
import { DbCoreModule } from '../db-core/db-core.module';
import { OpenaiModule } from '../openai/openai.module';
import { ScheduleType } from '../entities/treatment.schedule.entity';
import { OpenaiScheduleResponse } from '../openai/openai.service';

describe('ScheduleGeneratorService', () => {
  let service: ScheduleGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DbCoreModule, OpenaiModule],
      providers: [ScheduleGeneratorService],
    }).compile();

    service = module.get<ScheduleGeneratorService>(ScheduleGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('generate', async () => {
    await service.genByTreatmentId(4);
  }, 1000000);

  it('convert schedule json to schedule entity records', async () => {
    const schedules: OpenaiScheduleResponse[] = [
      {
        instruction: 'Бисопролол 5мг, 1 раз в день утром',
        schedules: [
          '2024-06-24T08:00',
          '2024-06-25T08:00',
          '2024-06-26T08:00',
          '2024-06-27T08:00',
          '2024-06-28T08:00',
          '2024-06-29T08:00',
          '2024-06-30T08:00',
          '2024-07-01T08:00',
          '2024-07-02T08:00',
          '2024-07-03T08:00',
          '2024-07-04T08:00',
          '2024-07-05T08:00',
          '2024-07-06T08:00',
          '2024-07-07T08:00',
          '2024-07-08T08:00',
          '2024-07-09T08:00',
          '2024-07-10T08:00',
          '2024-07-11T08:00',
          '2024-07-12T08:00',
          '2024-07-13T08:00',
          '2024-07-14T08:00',
          '2024-07-15T08:00',
          '2024-07-16T08:00',
          '2024-07-17T08:00',
          '2024-07-18T08:00',
          '2024-07-19T08:00',
          '2024-07-20T08:00',
          '2024-07-21T08:00',
          '2024-07-22T08:00',
        ],
      },
      {
        instruction: 'Аторвастатин 10мг, 1 раз в день вечером',
        schedules: [
          '2024-06-24T20:00',
          '2024-06-25T20:00',
          '2024-06-26T20:00',
          '2024-06-27T20:00',
          '2024-06-28T20:00',
          '2024-06-29T20:00',
          '2024-06-30T20:00',
          '2024-07-01T20:00',
          '2024-07-02T20:00',
          '2024-07-03T20:00',
          '2024-07-04T20:00',
          '2024-07-05T20:00',
          '2024-07-06T20:00',
          '2024-07-07T20:00',
          '2024-07-08T20:00',
          '2024-07-09T20:00',
          '2024-07-10T20:00',
          '2024-07-11T20:00',
          '2024-07-12T20:00',
          '2024-07-13T20:00',
          '2024-07-14T20:00',
          '2024-07-15T20:00',
          '2024-07-16T20:00',
          '2024-07-17T20:00',
          '2024-07-18T20:00',
          '2024-07-19T20:00',
          '2024-07-20T20:00',
          '2024-07-21T20:00',
          '2024-07-22T20:00',
        ],
      },
    ];
    service.convert(1, ScheduleType.MEDICATION, schedules[0]);
  });
});
