import { Module } from '@nestjs/common';
import { IdManagerService } from './id-manager.service';
import { ConfigModule } from '@nestjs/config';
import { DbCoreModule } from '../db-core/db-core.module';
import { IdManagerMessengerService } from './id-manager.messenger.service';
import { IdManagerClinicService } from './id-manager.clinic.service';

@Module({
  imports: [ConfigModule, DbCoreModule],
  providers: [
    IdManagerService,
    IdManagerMessengerService,
    IdManagerClinicService,
  ],
  exports: [
    IdManagerService,
    IdManagerMessengerService,
    IdManagerClinicService,
  ],
})
export class IdManagerModule {}
