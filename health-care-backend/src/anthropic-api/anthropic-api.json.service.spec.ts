import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AnthropicApiJsonService } from './anthropic-api.json.service';

describe('AnthropicApiJsonService', () => {
  let service: AnthropicApiJsonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [AnthropicApiJsonService],
    }).compile();

    service = module.get<AnthropicApiJsonService>(AnthropicApiJsonService);
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
        request: rawMedicineDescription,
      };
      // Шаг 1: Извлечение медицинской информации
      const extractedData = await service.complete(
        params,
        'medical-info-extraction-prompt.json',
      );
      console.log('Extraction result:', extractedData);
      const checkExtractionResult = await service.complete(
        {
          extractedData,
          originalText: rawMedicineDescription,
        },
        'medical-info-extraction-result-checker.json',
      );
      console.log(checkExtractionResult);
      // Шаг 2: Проверка извлеченной медицинской информации
      // params['PARAM_JSON_MEDICINE_CONCLUSION'] = extractionResult;
      // const extractionCheckResult = await service.complete(
      //   params,
      //   'medical-info-extraction-prompt-checker.md',
      // );
      // console.log('Extraction result:', extractionCheckResult);
    });
  });
});
