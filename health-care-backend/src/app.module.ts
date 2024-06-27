import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbCoreModule } from './db-core/db-core.module';
import { OpenaiModule } from './openai/openai.module';
import { TreatmentModule } from './treatment/treatment.module';
import { IdManagerModule } from './id-manager/id-manager.module';
import { ScheduleGeneratorModule } from './schedule-generator/schedule-generator.module';
import { MessengerModule } from './messenger/messenger.module';
import { ScheduleTaskModule } from './schedule-task/schedule-task.module';

@Module({
  imports: [
    DbCoreModule,
    OpenaiModule,
    TreatmentModule,
    IdManagerModule,
    ScheduleGeneratorModule,
    MessengerModule,
    ScheduleTaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
