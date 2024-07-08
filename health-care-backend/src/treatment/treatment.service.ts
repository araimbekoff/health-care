import { Injectable, Logger } from '@nestjs/common';
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
// import { TgContext } from '../messenger/impl/telegram.service';

@Injectable()
export class TreatmentService {
  logger = new Logger(TreatmentService.name);

  constructor(
    @InjectRepository(TreatmentEntity)
    private readonly treatmentRepo: Repository<TreatmentEntity>,
    private readonly idManagerService: IdManagerService,
    private readonly idManagerClinicService: IdManagerClinicService,
    private readonly scheduleGeneratorService: ScheduleGeneratorService,
    private readonly openaiService: OpenaiService,
  ) {}

  private async loadLastTreatment(
    user: UserEntity,
    treatmentType: TreatmentType,
  ) {
    const treatment = await this.treatmentRepo.findOneBy({
      user_id: user.id,
      type: treatmentType,
      is_actual: true,
    });
    console.log(treatment === null);
    return treatment;
  }

  @Transactional()
  async saveFromRawText(raw_text: string) {
    const dtoRaw = await this.extractRawDto(raw_text);
    const doctor_phone = dtoRaw.data.find((it) => it.field === 'doctor_phone');
    const clinic_uin = dtoRaw.data.find((it) => it.field === 'clinic_uin');
    const doctor = await this.idManagerClinicService.registerDoctor(
      '',
      doctor_phone.value,
      clinic_uin.value,
    );
    return await this.save(raw_text, dtoRaw, TreatmentType.AG, doctor);
  }

  private async extractRawDto(raw_text: string) {
    const dtoRaw = await this.openaiService.parseRawToTreatment(raw_text);
    const control_fields_map = {
      phone: false,
      full_name: false,
      // medical_history: false,
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
        `Пожалуйста, дополните описание недостающими сведениями:
         ${missing_fields.join('\n- ')}`,
      );
    }
    return dtoRaw;
  }

  async save(
    raw_text: string,
    dto: TreatmentRawDto,
    treatmentType: TreatmentType,
    doctor: DoctorEntity,
  ) {
    const user = await this.idManagerService.createUserByTreatmentRaw(dto);
    const treatment = await this.saveFromRawInternal(
      raw_text,
      user,
      doctor,
      dto,
      treatmentType,
    );
    await this.scheduleGeneratorService.genByTreatment(treatment);
    return treatment;
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

  static genReport(treatment: TreatmentEntity) {
    if (!treatment) {
      return '`У вас нет действующих рекомендаций.`';
    }
    return [
      treatment.medications_raw
        ? `Прием лекарств: \`${treatment.medications_raw.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')}\` `
        : null,
      treatment.exercises_raw
        ? `Упраженения: \`${treatment.exercises_raw.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')}\` `
        : null,
      treatment.procedures_raw
        ? `Процедуры: \`${treatment.procedures_raw.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')}\` `
        : null,
    ]
      .filter((it) => !!it)
      .join('\n');
    // .replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
  }

  async loadReportByPhone(phone: string) {
    return TreatmentService.genReport(await this.loadByPhone(phone));
  }

  async loadByPhone(phone: string) {
    const user = await this.idManagerService.findUser(phone);
    return await this.loadLastTreatment(user, TreatmentType.AG);
  }
}
