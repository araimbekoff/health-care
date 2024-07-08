import { Test, TestingModule } from '@nestjs/testing';
import { TreatmentService } from './treatment.service';
import { ConfigModule } from '@nestjs/config';
import { DbCoreModule } from '../db-core/db-core.module';
import { IdManagerModule } from '../id-manager/id-manager.module';
import { ScheduleGeneratorModule } from '../schedule-generator/schedule-generator.module';
import { OpenaiModule } from '../openai/openai.module';

// const callback = () => {};
// const callbackError = (e: Error) => {
//   console.error(e);
//   throw new Error(e.message);
// };

describe('TreatmentService', () => {
  let service: TreatmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        DbCoreModule,
        IdManagerModule,
        ScheduleGeneratorModule,
        OpenaiModule,
      ],
      providers: [TreatmentService],
    }).compile();

    service = module.get<TreatmentService>(TreatmentService);
  });

  it('treatment save from raw text', async () => {
    const data = `
    ФИО Андреев Иван Сергеевич
    тел +77774041000
    пол М
    дата рождения 1968-05-14
    адрес г. Петропавловск, ул. Советская, д. 30, кв. 12
    жалобы Частые головокружения.
    мед история: Гипертоническая болезнь III стадии, сахарный диабет II типа.
    рекомендации:
    Лизиноприл 10мг, 2 раза в день, Метформин 1000мг, 2 раза в день
    Мониторинг артериального давления 2 раза в неделю, Анализ крови на глюкозу 1 раз в месяц
    Прогулки на свежем воздухе 15 минут ежедневно, Легкие растяжки 2 раза в неделю
    контакты врача +77762131616
    БИН 8202283999094
`;

    await service.saveFromRawText(data);
  }, 100000);
});
