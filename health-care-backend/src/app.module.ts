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
import { ScheduleResponseModule } from './schedule-response/schedule-response.module';
import { GlobalConfigModule } from './global-config/global-config.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DbCoreModule,
    OpenaiModule,
    TreatmentModule,
    IdManagerModule,
    ScheduleGeneratorModule,
    MessengerModule,
    ScheduleTaskModule,
    ScheduleResponseModule,
    GlobalConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
