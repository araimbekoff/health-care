import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { User } from 'telegraf/typings/core/types/typegram';
import { ClinicEntity } from '../entities/clinic.entity';
import { DoctorEntity } from '../entities/doctor.entity';
import { TgContext } from '../messenger/impl/telegram.service';
import { OpenaiService } from '../openai/openai.service';
import { CustomLogger } from '../logger/custom.logger';

@Injectable()
export class IdManagerClinicService {
  logger = new CustomLogger(IdManagerClinicService.name);

  constructor(
    private readonly openaiService: OpenaiService,
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
  async registerDoctorByText(doctor_info: string, ctx: TgContext) {
    const res = await this.openaiService.parseDoctorInfo(doctor_info);
    try {
      if (!res.full_name) {
        await ctx.reply('Введите корректное имя врача');
      } else if (!res.phone) {
        await ctx.reply('Введите номер телефона врача');
      } else if (!res.clinic_uin) {
        await ctx.reply('Введите корректный БИН клиники');
      } else {
        await this.registerDoctor(res.full_name, res.phone, res.clinic_uin);
        await ctx.reply('Доктор добавлен успешно');
      }
    } catch (e) {
      this.logger.warn(`Error registerDoctorByText ${e.message}`);
      await ctx.reply(`Не получилось добавить доктора. Причины: ${e.message}`);
    }
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
