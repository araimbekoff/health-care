import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleResponseService } from './schedule-response.service';

describe('ScheduleResponseService', () => {
  let service: ScheduleResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleResponseService],
    }).compile();

    service = module.get<ScheduleResponseService>(ScheduleResponseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
