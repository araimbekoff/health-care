import { Test, TestingModule } from '@nestjs/testing';
import { IdManagerService } from './id-manager.service';

describe('IdManagerService', () => {
  let service: IdManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdManagerService],
    }).compile();

    service = module.get<IdManagerService>(IdManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
