import { Module } from '@nestjs/common';
import { AnthropicApiService } from './anthropic-api.service';
import { ConfigModule } from '@nestjs/config';
import { AnthropicApiJsonService } from './anthropic-api.json.service';

@Module({
  imports: [ConfigModule],
  providers: [AnthropicApiService, AnthropicApiJsonService],
})
export class AnthropicApiModule {}
