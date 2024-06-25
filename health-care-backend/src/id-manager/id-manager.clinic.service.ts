import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { User } from 'telegraf/typings/core/types/typegram';
import { ClinicEntity } from '../entities/clinic.entity';
import { DoctorEntity } from '../entities/doctor.entity';

@Injectable()
export class IdManagerClinicService {
  constructor(
    @InjectRepository(UserEntity)
    readonly userRepo: Repository<UserEntity>,
    @InjectRepository(ClinicEntity)
    readonly clinicRepo: Repository<ClinicEntity>,
    @InjectRepository(DoctorEntity)
    readonly doctorRepo: Repository<DoctorEntity>,
  ) {}

  async getUserByTelegram(telegramUser: User) {
    return await this.userRepo.findOneBy({ telegram_id: '' + telegramUser.id });
  }

  async getUserByPhone(phone: string) {
    return await this.userRepo.findOneBy({ phone });
  }

  private async loadOrCreateClinic(uin: string) {
    let clinic = await this.clinicRepo.findOneBy({ uin });
    if (!clinic) {
      clinic = await this.clinicRepo.save({ uin });
    }
    return clinic;
  }

  private async loadOrCreateUser(full_name: string, phone: string) {
    let user = await this.userRepo.findOneBy({ phone });
    if (!user) {
      user = await this.userRepo.save({ full_name, phone });
    }
    return user;
  }

  @Transactional()
  async registerDoctor(
    doctor_name: string,
    doctor_phone: string,
    clinic_uin: string,
  ) {
    const clinic = await this.loadOrCreateClinic(clinic_uin);
    const user = await this.loadOrCreateUser(doctor_name, doctor_phone);
    let doctor = await this.doctorRepo.findOneBy({
      clinic_id: clinic.id,
      user_id: user.id,
    });
    if (!doctor) {
      doctor = await this.doctorRepo.save({
        clinic_id: clinic.id,
        user_id: user.id,
        specialisation: '',
      });
    }
    return doctor;
  }

  async getDoctorByPhone(phone: string, clinic_uin: string) {
    const clinic = await this.clinicRepo.findOneBy({ uin: clinic_uin });
    if (!clinic) {
      throw new Error('Клиника не найдена');
    }
    const user = await this.userRepo.findOneBy({ phone });
    if (!user) {
      return null;
    }
    return await this.doctorRepo.findOneBy({ user_id: user.id });
  }
}
