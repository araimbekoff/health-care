import { Injectable } from '@nestjs/common';
import { TelegramService } from './impl/telegram.service';
import { TreatmentScheduleEntity } from '../entities/treatment.schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TreatmentEntity } from '../entities/treatment.entity';
import { Repository } from 'typeorm';
import { MessengerType, UserEntity } from '../entities/user.entity';

@Injectable()
export class MessengerService {
  constructor(
    private readonly telegramService: TelegramService,
    @InjectRepository(TreatmentEntity)
    private readonly treatmentRepo: Repository<TreatmentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async sendTreatment(schedule: TreatmentScheduleEntity) {
    const treatment = await this.treatmentRepo.findOneBy({
      id: schedule.treatment_id,
    });
    if (!treatment) {
      return;
    }
    const user = await this.userRepo.findOneBy({
      id: treatment.user_id,
    });
    const message = schedule.message_ctx;
    const { telegram_id } = user;
    const default_messenger = user.default_messenger || MessengerType.TELEGRAM;
    if (default_messenger === MessengerType.TELEGRAM && telegram_id) {
      await this.telegramService.sendMessage(user.telegram_id, message);
    }
    console.log(`schedule doesn't have telegram id`);
  }
}
