import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreatmentEntity } from '../entities/treatment.entity';
import { Repository } from 'typeorm';
import {
  OpenaiScheduleResponse,
  OpenaiService,
} from '../openai/openai.service';
import {
  ScheduleType,
  TreatmentScheduleEntity,
} from '../entities/treatment.schedule.entity';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ScheduleGeneratorService {
  constructor(
    @InjectRepository(TreatmentEntity)
    readonly treatmentRepo: Repository<TreatmentEntity>,
    @InjectRepository(TreatmentScheduleEntity)
    readonly treatmentScheduleRepo: Repository<TreatmentScheduleEntity>,
    readonly openaiService: OpenaiService,
  ) {}

  async genByTreatmentId(id: number) {
    const treatment = await this.treatmentRepo.findOneBy({ id });
    if (!treatment) {
      throw new Error(`Treatment with id ${id} not found`);
    }
    await this.genByTreatment(treatment);
  }

  async genByTreatment(treatment: TreatmentEntity) {
    // todo: why promises with warning?
    const promises = [
      this.saveSchedules(treatment, ScheduleType.MEDICATION),
      this.saveSchedules(treatment, ScheduleType.EXERCISE),
      this.saveSchedules(treatment, ScheduleType.PROCEDURE),
    ];
    await Promise.all(promises);
  }

  private async saveSchedules(
    treatment: TreatmentEntity,
    type: ScheduleType,
  ): Promise<TreatmentEntity | null> {
    const field_raw: string = type.trim() + '_raw';
    const field_json: string = type.trim() + '_json';
    const instructions_raw = treatment[field_raw];
    if (treatment[field_json]) {
      console.error('this schedule is generated');
      return treatment;
    } else {
      treatment[field_json] = '{}';
      try {
        await this.treatmentRepo.update(treatment.id, treatment);
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    }
    const treatment_id: number = treatment.id;
    const schedules_list = await this.openaiService.schedules(instructions_raw);
    for (const openaiSchedule of schedules_list) {
      const treatments = this.convert(treatment_id, type, openaiSchedule);
      await this.treatmentScheduleRepo.insert(treatments);
    }
    treatment[field_json] = JSON.stringify(schedules_list);
    await this.treatmentRepo.update(treatment.id, treatment);
    return treatment;
  }

  convert(
    treatment_id: number,
    type: ScheduleType,
    schedule: OpenaiScheduleResponse,
  ) {
    if (!schedule || !schedule.schedules || !schedule.schedules.length) {
      return null;
    }
    return schedule.schedules.map((dt) =>
      this.treatmentScheduleRepo.create({
        treatment_id,
        type,
        send_date: new Date(dt),
        message_ctx: schedule.instruction,
        is_sent: false,
      }),
    );
  }
}
