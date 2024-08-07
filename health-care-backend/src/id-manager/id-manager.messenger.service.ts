import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { User, Contact } from 'telegraf/typings/core/types/typegram';
import { DoctorEntity } from '../entities/doctor.entity';
import { ClinicEntity } from '../entities/clinic.entity';
import { ConfigService } from '@nestjs/config';

export class UserInfoDto {
  user: UserEntity;
  is_superuser: boolean;
  clinics?: ClinicEntity[];
}

@Injectable()
export class IdManagerMessengerService {
  constructor(
    @InjectRepository(ClinicEntity)
    readonly clinicRepo: Repository<ClinicEntity>,
    @InjectRepository(DoctorEntity)
    readonly doctorRepo: Repository<DoctorEntity>,
    @InjectRepository(UserEntity)
    readonly userRepo: Repository<UserEntity>,
    readonly configService: ConfigService,
  ) {}

  @Transactional()
  async getUserByTelegram(telegramUser: User): Promise<UserInfoDto> {
    const user = await this.userRepo.findOneBy({
      telegram_id: '' + telegramUser.id,
    });
    const doctors = !user
      ? null
      : await this.doctorRepo.findBy({ user_id: user.id });
    const clinics = doctors?.length
      ? await this.clinicRepo.findBy({
          id: In(doctors.map((it) => it.clinic_id)),
        })
      : null;
    return {
      user,
      is_superuser: this.isSuperUser(user),
      clinics,
    };
  }

  async saveTelegramContact(contact: Contact) {
    const { first_name, last_name, phone_number, user_id } = contact;
    let user = await this.userRepo.findOneBy({ phone: phone_number });
    if (user && user.telegram_id) {
      return user;
    }
    if (!user) {
      user = this.userRepo.create({
        full_name: [first_name, last_name].join(' '),
        telegram_id: user_id + '',
        phone: phone_number,
      });
    } else {
      user.full_name = user.full_name || [first_name, last_name].join(' ');
      user.telegram_id = user_id + '';
    }
    await this.userRepo.save(user);
  }

  isSuperUser(user: UserEntity) {
    if (!user || !user.phone) {
      return false;
    }
    return this.configService
      .get<string>('SUPERUSERS_PHONE')
      .includes(user.phone);
  }
}
