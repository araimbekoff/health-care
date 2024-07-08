import { Global, Module } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { TelegramService } from './impl/telegram.service';
import { ConfigModule } from '@nestjs/config';
import { IdManagerModule } from '../id-manager/id-manager.module';
import { TreatmentModule } from '../treatment/treatment.module';
import { DbCoreModule } from '../db-core/db-core.module';
import { ScheduleResponseModule } from '../schedule-response/schedule-response.module';
import { IdManagerClinicService } from '../id-manager/id-manager.clinic.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    DbCoreModule,
    IdManagerModule,
    TreatmentModule,
    ScheduleResponseModule,
  ],
  providers: [MessengerService, TelegramService],
  exports: [MessengerService, TelegramService],
})
export class MessengerModule {}
