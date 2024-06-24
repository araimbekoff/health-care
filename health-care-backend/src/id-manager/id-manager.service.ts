import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { TreatmentRawDto } from '../treatment/dto/treatmentRawDto';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class IdManagerService {
  constructor(
    @InjectRepository(UserEntity)
    readonly userRepo: Repository<UserEntity>,
  ) {}

  async findUser(phone: string) {
    return await this.userRepo.findOneBy({
      phone,
    });
  }

  @Transactional()
  async create(rec: UserEntity) {
    await this.userRepo.save(rec);
  }

  @Transactional()
  async createUserByTreatmentRaw(treatmentRawDto: TreatmentRawDto) {
    const { data } = treatmentRawDto;
    const rec = this.userRepo.create();
    const fields = ['phone', 'full_name', 'gender', 'birthday', 'address'];
    for (const field of data) {
      if (!fields.includes(field.field)) {
        continue;
      }
      rec[field.field] = field.value;
    }
    if (!rec.phone) {
      throw new Error("user doesn't created");
    }
    let user = await this.findUser(rec.phone);
    if (!user) {
      user = rec;
      await this.create(rec);
    }
    return user;
  }
}
