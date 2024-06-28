import { Module } from '@nestjs/common';
import { ScheduleResponseService } from './schedule-response.service';
import { ConfigModule } from '@nestjs/config';
import { DbCoreModule } from '../db-core/db-core.module';

@Module({
  imports: [ConfigModule, DbCoreModule],
  providers: [ScheduleResponseService],
  exports: [ScheduleResponseService],
})
export class ScheduleResponseModule {}
