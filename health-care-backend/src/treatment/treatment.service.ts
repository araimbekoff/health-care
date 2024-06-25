import { Injectable } from '@nestjs/common';
import { TreatmentRawDto, TreatmentRawFieldDto } from './dto/treatmentRawDto';
import { InjectRepository } from '@nestjs/typeorm';
import { TreatmentEntity, TreatmentType } from '../entities/treatment.entity';
import { Repository } from 'typeorm';
import { IdManagerService } from '../id-manager/id-manager.service';
import { UserEntity } from '../entities/user.entity';
import { ScheduleGeneratorService } from '../schedule-generator/schedule-generator.service';
import { OpenaiService } from '../openai/openai.service';
import { Transactional } from 'typeorm-transactional';
import { IdManagerClinicService } from '../id-manager/id-manager.clinic.service';
import { DoctorEntity } from '../entities/doctor.entity';
import { rethrow } from '@nestjs/core/helpers/rethrow';

@Injectable()
export class TreatmentService {
  constructor(
    @InjectRepository(TreatmentEntity)
    readonly treatmentRepo: Repository<TreatmentEntity>,
    readonly idManagerService: IdManagerService,
    readonly idManagerClinicService: IdManagerClinicService,
    readonly scheduleGeneratorService: ScheduleGeneratorService,
    readonly openaiService: OpenaiService,
  ) {}

  private async loadLastTreatment(
    user: UserEntity,
    treatmentType: TreatmentType,
  ) {
    return await this.treatmentRepo.findOneBy({
      user_id: user.id,
      type: treatmentType,
      is_actual: true,
    });
  }

  @Transactional()
  async saveFromRawText(
    raw_text: string,
    callback: (param: number | TreatmentEntity, report: string) => void,
    callbackError: (e: Error) => void,
  ) {
    const dtoRaw = await this.extractRawDto(raw_text);
    const doctor_phone = dtoRaw.data.find((it) => it.field === 'doctor_phone');
    const clinic_uin = dtoRaw.data.find((it) => it.field === 'clinic_uin');
    const doctor = await this.idManagerClinicService.registerDoctor(
      '',
      doctor_phone.value,
      clinic_uin.value,
    );
    await this.save(
      raw_text,
      dtoRaw,
      TreatmentType.AG,
      doctor,
      callback,
      callbackError,
    );
  }

  private async extractRawDto(raw_text: string) {
    const dtoRaw = await this.openaiService.parseRawToTreatment(raw_text);
    const control_fields_map = {
      phone: false,
      full_name: false,
      medical_history: false,
      medications_raw: false,
      procedures_raw: false,
      exercises_raw: false,
      doctor_phone: false,
      clinic_uin: false,
    };
    const control_fields = Object.keys(control_fields_map);
    const missing_fields = [];
    for (const field of dtoRaw.data) {
      if (control_fields.includes(field.field)) {
        if (field.value) {
          control_fields_map[field.field] = true;
        } else {
          missing_fields.push(field.title);
        }
      }
    }
    if (missing_fields.length) {
      throw new Error(
        `Пожалуйста, дополните описание недостающими сведениями: ${missing_fields.join('\n')}`,
      );
    }
    return dtoRaw;
  }

  async save(
    raw_text: string,
    dto: TreatmentRawDto,
    treatmentType: TreatmentType,
    doctor: DoctorEntity,
    callback: (param: number | TreatmentEntity, report: string) => void,
    callbackError: (e: Error) => void,
  ) {
    const user = await this.idManagerService.createUserByTreatmentRaw(dto);
    const treatment = await this.saveFromRawInternal(
      raw_text,
      user,
      doctor,
      dto,
      treatmentType,
    );
    this.scheduleGeneratorService
      .genByTreatment(treatment)
      .then(() => callback(treatment, this.genReport(treatment)))
      .catch((e: Error) => callbackError(e));
  }

  @Transactional()
  async saveFromRawInternal(
    raw_text: string,
    user: UserEntity,
    doctor: DoctorEntity,
    dto: TreatmentRawDto,
    treatmentType: TreatmentType,
  ) {
    let rec = this.convertToTreatment(dto.data);
    rec.raw_text = raw_text;
    rec.user = user;
    rec.type = treatmentType;
    rec.doctor_id = doctor.id;
    const dbRec = await this.loadLastTreatment(user, treatmentType);
    const as_ald_treatment = rec.compareEntities(dbRec);
    if (!as_ald_treatment) {
      rec.rec_date = new Date();
      rec.is_actual = true;
      rec = await this.treatmentRepo.save(rec);
    } else {
      rec = dbRec;
    }
    return rec;
  }

  convertToTreatment(data: TreatmentRawFieldDto[]) {
    const map = this.treatmentRepo.create();
    for (const field of data) {
      map[field.field] = field.value;
    }
    return this.treatmentRepo.create(map);
  }

  private genReport(treatment: TreatmentEntity) {
    return [
      treatment.medications_raw
        ? `- Прием лекарств: \`${treatment.medications_raw}\'`
        : null,
      treatment.exercises_raw
        ? `- Упраженения: \`${treatment.exercises_raw}\` `
        : null,
      treatment.procedures_raw
        ? `- Процедуры: \`${treatment.procedures_raw}\` `
        : null,
    ]
      .filter((it) => !!it)
      .join('\n');
  }
}
