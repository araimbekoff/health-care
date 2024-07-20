import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { LlmApiService, LlmType } from './llm-api.service';
import * as path from 'path';
import * as fs from 'fs/promises';

/*
const loadFileToText = async (file__name: string) => {
  const promptPath = path.join(
    '/opt/projects/health-care/health-care-backend/src/anthropic-api/test/',
    file__name,
  );
  return await fs.readFile(promptPath, 'utf-8');
};
*/

class TestCases {
  private readonly service: LlmApiService;
  private llmType: LlmType;
  private readonly resource: string;
  private readonly workdir: string =
    '/opt/projects/health-care/health-care-backend/src/llm-api/test';

  constructor(service: LlmApiService, test_resource: string, llmType: LlmType) {
    this.llmType = llmType;
    this.service = service;
    this.resource = test_resource;
  }

  setType(llmType: LlmType) {
    this.llmType = llmType;
  }

  private resource_file_path() {
    return 'data/' + this.resource + '.txt';
  }

  private extraction_file_path() {
    return `results/${this.llmType}-${this.resource}-extraction.json`;
  }

  private extraction_validate_path() {
    return `results/${this.llmType}-${this.resource}-extraction-validate.json`;
  }

  private schedule_file_path() {
    return `results/${this.llmType}-${this.resource}-schedules.json`;
  }

  async extraction() {
    const start = Date.now();
    const request = await this.loadFileToText(this.resource_file_path());
    const prompt = await this.service.loadPrompt(
      'medical-info-extraction-prompt.json',
      {
        request,
      },
    );
    const res = await this.service.generate(prompt, this.llmType);
    const end = Date.now();
    console.log(
      `extraction with ${this.resource} ${this.llmType}`,
      (end - start) / 1000,
    );
    await this.writeToFile(this.extraction_file_path(), res);
  }

  async schedule_generation() {
    const start = Date.now();
    const extractedData = await this.loadFileToText(
      this.extraction_file_path(),
    );
    const data = JSON.parse(extractedData);
    const prompt = await this.service.loadPrompt(
      'recommendation-schedules-prompt.json',
      {
        'inputData.currentDate': new Date().toLocaleDateString(),
        'inputData.recommendations': JSON.stringify(data['recommendations']),
      },
    );
    const res = await this.service.generate(prompt, this.llmType);
    const end = Date.now();

    console.log(
      `schedule_generation with ${this.resource} ${this.llmType}`,
      (end - start) / 1000,
    );
    await this.writeToFile(this.schedule_file_path(), res);
  }

  async validate_extraction() {
    const start = Date.now();
    const originalText = await this.loadFileToText(this.resource_file_path());
    const extractedData = await this.loadFileToText(
      this.extraction_file_path(),
    );
    const prompt = await this.service.loadPrompt(
      'medical-info-extraction-result-checker.json',
      {
        originalText,
        extractedData,
      },
    );
    const res = await this.service.generate(prompt, this.llmType);
    const end = Date.now();

    console.log(
      `validate_extraction with ${this.resource} ${this.llmType}`,
      (end - start) / 1000,
    );
    await this.writeToFile(this.extraction_validate_path(), res);
  }

  async loadFileToText(file_name: string) {
    const fp = path.join(this.workdir, file_name);
    return await fs.readFile(fp, 'utf-8');
  }

  async writeToFile(file_name: string, text: string) {
    const fp = path.join(this.workdir, file_name);
    return await fs.writeFile(fp, text);
  }
}

describe('LlmApiJsonService', () => {
  let service: LlmApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [LlmApiService],
    }).compile();

    service = module.get<LlmApiService>(LlmApiService);
  });

  describe('Medical Info Extraction and Checking', () => {
    it('test use case', async () => {
      const src_list = [
        // 'example-1',
        'example-2',
        'example-3',
        // 'example-4',
        // 'hobl-1',
        'hobl-2',
        'hobl-3',
        // 'hobl-4',
      ];
      /*
      const promises = [];
            for (const src of src_list) {
              promises.push(async () => {
                const cases = new TestCases(service, src, 'anthropic');
                await cases.extraction();
                await cases.validate_extraction();
                cases.setType('openai');
                await cases.extraction();
                await cases.validate_extraction();
              });
            }
      */
      const promises = [
        ...src_list.map(async (src) => {
          const cases = new TestCases(service, src, 'openai');
          await cases.schedule_generation();
        }),
      ];
      await Promise.all(promises);
    });
    /*
        it('should extract medical info, check it, and generate a schedule', async () => {
          // const request = await loadFileToText('example-1.txt');
          const resource = 'hobl';
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
    */
  });
});
