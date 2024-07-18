import { Test, TestingModule } from '@nestjs/testing';
import { AnthropicApiService, PromptType } from '../anthropic-api.service';
import { ConfigModule } from '@nestjs/config';

describe('AnthropicApiService', () => {
  let service: AnthropicApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [AnthropicApiService],
    }).compile();

    service = module.get<AnthropicApiService>(AnthropicApiService);
  });
  const rawMedicineDescription = `
        Пациент: Иванов Иван Иванович, 45 лет. 
        Контакты: +7 (900) 123-45-67, email: ivanov@example.com
        Контакт для экстренной связи: Иванова Мария Петровна (жена), тел: +7 (900) 765-43-21
        Диагноз: Гипертоническая болезнь II стадии, риск 3.
        Назначения:
        1. Амлодипин 5мг 1 раз в день утром после еды
        2. Лозартан 50мг 1 раз в день вечером
        3. Контроль артериального давления 2 раза в день (утром и вечером)
        4. Ходьба 30 минут ежедневно
        5. Ограничение соли до 5г в сутки
        6. Повторный прием через 2 недели
      `;

  describe('Medical Info Extraction and Checking', () => {
    it('should extract medical info, check it, and generate a schedule', async () => {
      console.log('Raw medicine description:', rawMedicineDescription);
      const params = {
        PARAM_RAW_MEDICINE_CONCLUSION: rawMedicineDescription,
      };
      // Шаг 1: Извлечение медицинской информации
      const extractionResult = await service.complete(
        params,
        'medical-info-extraction-prompt.md',
      );
      // Шаг 2: Проверка извлеченной медицинской информации
      params['PARAM_JSON_MEDICINE_CONCLUSION'] = extractionResult;
      const extractionCheckResult = await service.complete(
        params,
        'medical-info-extraction-prompt-checker.md',
      );
      console.log('Extraction result:', extractionCheckResult);
    });
  });
});
