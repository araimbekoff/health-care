import { Module } from '@nestjs/common';
import { IdManagerService } from './id-manager.service';
import { ConfigModule } from '@nestjs/config';
import { DbCoreModule } from '../db-core/db-core.module';

@Module({
  imports: [ConfigModule.forRoot(), DbCoreModule],
  providers: [IdManagerService],
  exports: [IdManagerService],
})
export class IdManagerModule {}
