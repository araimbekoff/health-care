import { Module } from '@nestjs/common';
import { ScheduleGeneratorService } from './schedule-generator.service';
import { DbCoreModule } from '../db-core/db-core.module';
import { ConfigModule } from '@nestjs/config';
import { OpenaiModule } from '../openai/openai.module';

@Module({
  imports: [ConfigModule.forRoot(), DbCoreModule, OpenaiModule],
  providers: [ScheduleGeneratorService],
  exports: [ScheduleGeneratorService],
})
export class ScheduleGeneratorModule {}
