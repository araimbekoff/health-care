import { Module } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { TelegramService } from './impl/telegram.service';
import { ConfigModule } from '@nestjs/config';
import { IdManagerModule } from '../id-manager/id-manager.module';
import { TreatmentModule } from '../treatment/treatment.module';
import { DbCoreModule } from '../db-core/db-core.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DbCoreModule,
    IdManagerModule,
    TreatmentModule,
  ],
  providers: [MessengerService, TelegramService],
  exports: [MessengerService],
})
export class MessengerModule {}
