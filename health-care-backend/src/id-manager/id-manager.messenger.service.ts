import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { User, Contact } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class IdManagerMessengerService {
  constructor(
    @InjectRepository(UserEntity)
    readonly userRepo: Repository<UserEntity>,
  ) {}

  @Transactional()
  async getUserByTelegram(telegramUser: User) {
    return await this.userRepo.findOneBy({ telegram_id: '' + telegramUser.id });
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
      user.full_name = [first_name, last_name].join(' ');
      user.telegram_id = user_id + '';
    }
    await this.userRepo.save(user);
  }
}
