import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LlmApiService } from './llm-api.service';

@Module({
  imports: [ConfigModule],
  providers: [LlmApiService],
})
export class LlmApiModule {}
