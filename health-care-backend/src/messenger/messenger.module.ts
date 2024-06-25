import { Module } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { TelegramService } from './impl/telegram.service';
import { ConfigModule } from '@nestjs/config';
import { IdManagerModule } from '../id-manager/id-manager.module';
import { TreatmentModule } from '../treatment/treatment.module';

@Module({
  imports: [ConfigModule.forRoot(), IdManagerModule, TreatmentModule],
  providers: [MessengerService, TelegramService],
})
export class MessengerModule {}
