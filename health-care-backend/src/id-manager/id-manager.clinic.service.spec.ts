import { Test, TestingModule } from '@nestjs/testing';
import { IdManagerClinicService } from './id-manager.clinic.service';
import { DbCoreModule } from '../db-core/db-core.module';
import { initializeTransactionalContext } from 'typeorm-transactional';

describe('IdManagerClinicService', () => {
  let service: IdManagerClinicService;
  initializeTransactionalContext();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DbCoreModule],
      providers: [IdManagerClinicService],
    }).compile();

    service = module.get<IdManagerClinicService>(IdManagerClinicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('register doctor', async () => {
    const doctor_name = 'Абенов Батыр Вахитович';
    const doctor_phone = '+77762131616';
    const clinic_name = 'Здоровье+';
    await service.registerDoctor(doctor_name, doctor_phone, clinic_name);
  });
});
