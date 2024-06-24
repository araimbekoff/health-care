import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  // Initialize transactional context
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);
  app.use(
    cors({
      origin: ['http://localhost:9002', 'http://localhost:9000'],
    }),
  );
  await app.listen(3000);
}

bootstrap().then(() => console.log('ok'));
