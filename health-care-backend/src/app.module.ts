import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbCoreModule } from './db-core/db-core.module';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [DbCoreModule, OpenaiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
