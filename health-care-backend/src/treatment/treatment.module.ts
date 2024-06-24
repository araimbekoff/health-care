import { Module } from '@nestjs/common';
import { TreatmentService } from './treatment.service';
import { ConfigModule } from '@nestjs/config';
import { DbCoreModule } from '../db-core/db-core.module';
import { IdManagerModule } from '../id-manager/id-manager.module';
import { OpenaiModule } from '../openai/openai.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DbCoreModule,
    IdManagerModule,
    OpenaiModule,
  ],
  providers: [TreatmentService],
})
export class TreatmentModule {}
