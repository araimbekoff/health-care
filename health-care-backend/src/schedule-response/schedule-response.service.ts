import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TreatmentResponseEntity } from '../entities/treatment.response.entity';
import { TreatmentScheduleEntity } from '../entities/treatment.schedule.entity';
import {
  parseScheduleResponse,
  ScheduleResponseType,
} from '../messenger/dto/messenger-dtos';
import { Transactional } from 'typeorm-transactional';
import { TreatmentEntity } from '../entities/treatment.entity';
import { CustomLogger } from '../logger/custom.logger';

export class ResponseRegisteringResultDto {
  mess: string;
  schedule?: TreatmentScheduleEntity;
  markdown?: boolean;
}

@Injectable()
export class ScheduleResponseService {
  logger = new CustomLogger(ScheduleResponseService.name);

  constructor(
    @InjectRepository(TreatmentScheduleEntity)
    private readonly treatmentScheduleRepo: Repository<TreatmentScheduleEntity>,
    @InjectRepository(TreatmentResponseEntity)
    private readonly treatmentResponseRepo: Repository<TreatmentResponseEntity>,
    @InjectRepository(TreatmentEntity)
    private readonly treatmentRepo: Repository<TreatmentEntity>,
  ) {}

  @Transactional()
  async registerCallbackData(
    callback_data: string,
  ): Promise<ResponseRegisteringResultDto> {
    const response = parseScheduleResponse(callback_data);
    if (!response) {
      this.logger.warn(
        `unable schedule response ${JSON.stringify(callback_data)}`,
      );
      return {
        mess: 'Неизвестное напоминание',
      };
    }
    const schedule = await this.treatmentScheduleRepo.findOneBy({
      id: response.schedule_id,
    });
    if (response.type === ScheduleResponseType.RESPONSE) {
      await this.treatmentResponseRepo.save({
        response_date: new Date(),
        schedule_id: response.schedule_id,
      });
      return {
        mess: `Выполнено: 
        - ${schedule.message_ctx}
        
        Время:
        - ${new Date().toTimeString().match(/^(\d{2}:\d{2})/)?.[1] ?? ''} 
        `,
      };
    } else if (response.type === ScheduleResponseType.REMIND_AFTER) {
      const treatment = await this.treatmentRepo.findOneBy({
        id: schedule.treatment_id,
      });
      if (treatment.is_actual) {
        const rec = this.treatmentScheduleRepo.create(schedule);
        delete rec.id;
        rec.send_date = new Date();
        rec.send_date.setMinutes(
          rec.send_date.getMinutes() + response.remind_after_min,
        );
        await this.treatmentScheduleRepo.save(rec);
        return {
          mess: `Напоминание отложено на ${response.remind_after_min} минут.
          - ${rec.message_ctx}
          `,
          schedule: rec,
        };
      } else {
        console.warn(`schedule is not actual. schedule.id = ${schedule.id}`);
        return {
          mess: `Рекомендация неактуальна. Пожалуйста, свяжитесь с вашим лечащим врачом.`,
        };
      }
    }
    this.logger.error(
      `Unable ScheduleResponseType ${response.type}, schedule_id=${response.schedule_id} `,
    );
    return {
      mess: `Произошла системная ошибка. Мы принимаем меры`,
    };
  }
}
