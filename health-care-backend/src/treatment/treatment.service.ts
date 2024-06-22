import { Injectable } from '@nestjs/common';
import { TreatmentRawDto } from './dto/treatmentRawDto';
import { InjectRepository } from '@nestjs/typeorm';
import { TreatmentEntity, TreatmentType } from '../entities/treatment.entity';
import { Repository } from 'typeorm';
import { IdManagerService } from '../id-manager/id-manager.service';
import { UserEntity } from '../entities/user.entity';
import * as _ from 'lodash';

@Injectable()
export class TreatmentService {
  constructor(
    @InjectRepository(TreatmentEntity)
    readonly treatmentRepo: Repository<TreatmentEntity>,
    readonly idManagerService: IdManagerService,
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

  async save(dto: TreatmentRawDto, treatmentType: TreatmentType) {
    const user = await this.idManagerService.createUserByTreatmentRaw(dto);
    const rec = this.convertToTreatment(dto);
    rec.user = user;
    rec.type = treatmentType;

    if (
      rec.compareEntities(await this.loadLastTreatment(user, treatmentType))
    ) {
      return;
    }
    rec.rec_date = new Date();
    rec.is_actual = true;
    await this.treatmentRepo.save(rec);
  }

  compareRecords(dbRec: TreatmentEntity, newRec: TreatmentEntity) {
    const ignoreFields = [
      'id',
      'rec_date',
      'is_actual',
      'user_id',
      'user',
      'medications_json',
      'procedures_json',
      'exercises_json',
    ];
    const filteredObj1 = _.omit(dbRec, ignoreFields);
    const filteredObj2 = _.omit(newRec, ignoreFields);
    return _.isEqual(filteredObj1, filteredObj2);
  }

  convertToTreatment(dto: TreatmentRawDto) {
    const rec = this.treatmentRepo.create();
    for (const field of dto.data) {
      rec[field.field] = field.value;
    }
    return rec;
  }
}
