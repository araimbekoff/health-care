import { Module } from '@nestjs/common';
import { TreatmentService } from './treatment.service';

@Module({
  providers: [TreatmentService]
})
export class TreatmentModule {}
