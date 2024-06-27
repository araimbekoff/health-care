import { Module } from '@nestjs/common';
import { ScheduleTaskService } from './schedule-task.service';
import { ScheduleModule } from '@nestjs/schedule';
import { DbCoreModule } from '../db-core/db-core.module';
import { MessengerModule } from '../messenger/messenger.module';

@Module({
  imports: [DbCoreModule, ScheduleModule.forRoot(), MessengerModule],
  providers: [ScheduleTaskService],
})
export class ScheduleTaskModule {}
