import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbCoreModule } from './db-core/db-core.module';
import { OpenaiModule } from './openai/openai.module';
import { TreatmentModule } from './treatment/treatment.module';
import { IdManagerModule } from './id-manager/id-manager.module';
import { ScheduleGeneratorModule } from './schedule-generator/schedule-generator.module';

@Module({
  imports: [
    DbCoreModule,
    OpenaiModule,
    TreatmentModule,
    IdManagerModule,
    ScheduleGeneratorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
