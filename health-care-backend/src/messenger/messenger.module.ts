import { Global, Module } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { TelegramService } from './impl/telegram.service';
import { ConfigModule } from '@nestjs/config';
import { IdManagerModule } from '../id-manager/id-manager.module';
import { TreatmentModule } from '../treatment/treatment.module';
import { DbCoreModule } from '../db-core/db-core.module';
import { ScheduleResponseModule } from '../schedule-response/schedule-response.module';
import { TgViewMyTreatmentsCmd } from './impl/commands/tg-view-my-treatments.cmd';
import { TgAddPatientTreatmentsCmd } from './impl/commands/tg-add-patient-treatments.cmd';
import { TgDoctorRegistrationCmd } from './impl/commands/tg-doctor-registration-cmd';
import { TgStartCmd } from './impl/commands/tg-start.cmd';
import { OpenaiModule } from '../openai/openai.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    DbCoreModule,
    IdManagerModule,
    TreatmentModule,
    ScheduleResponseModule,
    OpenaiModule,
  ],
  providers: [
    MessengerService,
    TelegramService,
    TgViewMyTreatmentsCmd,
    TgAddPatientTreatmentsCmd,
    TgDoctorRegistrationCmd,
    TgStartCmd,
  ],
  exports: [MessengerService, TelegramService],
})
export class MessengerModule {}
