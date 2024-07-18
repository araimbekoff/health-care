import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AnthropicApiJsonService } from '../anthropic-api.json.service';
import * as path from 'path';
import * as fs from 'fs/promises';

const loadFileToText = async (file__name: string) => {
  const promptPath = path.join(
    '/opt/projects/health-care/health-care-backend/src/anthropic-api/test/data/',
    file__name,
  );
  return await fs.readFile(promptPath, 'utf-8');
};

describe('AnthropicApiJsonService', () => {
  let service: AnthropicApiJsonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [AnthropicApiJsonService],
    }).compile();

    service = module.get<AnthropicApiJsonService>(AnthropicApiJsonService);
  });

  describe('Medical Info Extraction and Checking', () => {
    it('should extract medical info, check it, and generate a schedule', async () => {
      // const request = await loadFileToText('example-1.txt');
      const request = await loadFileToText('hobl-1.txt');
      console.log(request);

      console.log('Raw medicine description:', request);
      const params = {
        request,
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
          originalText: request,
        },
        'medical-info-extraction-result-checker.json',
      );
      console.log(checkExtractionResult);
      // // Шаг 2: Проверка извлеченной медицинской информации
      // params['PARAM_JSON_MEDICINE_CONCLUSION'] = extractionResult;
      // const extractionCheckResult = await service.complete(
      //   params,
      //   'medical-info-extraction-prompt-checker.md',
      // );
      // console.log('Extraction result:', extractionCheckResult);
    });
  });
});
