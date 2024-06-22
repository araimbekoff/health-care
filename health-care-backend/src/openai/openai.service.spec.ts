import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiService } from './openai.service';
import { ConfigModule } from '@nestjs/config';

describe('OpenaiService', () => {
  let service: OpenaiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [OpenaiService],
    }).compile();

    service = module.get<OpenaiService>(OpenaiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('test schedule prompt', async () => {
    const instructions: string[] | null[] = [
      'Лизиноприл 10мг, 2 раза в день, Метформин 1000мг, 2 раза в день',
      'Мониторинг артериального давления 2 раза в неделю, Анализ крови на глюкозу 1 раз в месяц',
      'Легкие растяжки 2 раза в неделю, Прогулки на свежем воздухе 15 минут ежедневно',
    ];

    await service.schedules(instructions[2]);
  });
});
