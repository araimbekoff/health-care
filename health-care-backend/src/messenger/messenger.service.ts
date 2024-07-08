// messenger.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { TelegramService } from './impl/telegram.service';
import { TreatmentScheduleEntity } from '../entities/treatment.schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TreatmentEntity } from '../entities/treatment.entity';
import { Repository } from 'typeorm';
import { MessengerType, UserEntity } from '../entities/user.entity';
import {
  genResponseCallback,
  genResponseRemindCallback,
  TreatmentScheduleResponseDto,
} from './dto/messenger-dtos';

@Injectable()
export class MessengerService {
  private readonly logger = new Logger(MessengerService.name);

  constructor(
    private readonly telegramService: TelegramService,
    @InjectRepository(TreatmentEntity)
    private readonly treatmentRepo: Repository<TreatmentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async sendTreatment(schedule: TreatmentScheduleEntity): Promise<void> {
    const treatment = await this.treatmentRepo.findOneBy({
      id: schedule.treatment_id,
    });
    if (!treatment) {
      this.logger.warn(`Treatment with id ${schedule.treatment_id} not found`);
      return;
    }

    const user = await this.userRepo.findOneBy({ id: treatment.user_id });
    if (!user) {
      this.logger.warn(`User with id ${treatment.user_id} not found`);
      return;
    }

    const { telegram_id, default_messenger } = user;
    if (
      (!default_messenger || default_messenger === MessengerType.TELEGRAM) &&
      telegram_id
    ) {
      await this.sendViaTelegram(user, schedule);
    } else {
      this.logger.warn(`User with id ${user.id} doesn't have a Telegram-id`);
    }
  }

  private async sendViaTelegram(
    user: UserEntity,
    schedule: TreatmentScheduleEntity,
  ): Promise<void> {
    const message = schedule.message_ctx;
    const buttons: TreatmentScheduleResponseDto[] = [
      {
        title: 'Я принял лекарство',
        callback_data: genResponseCallback(schedule.id),
      },
      {
        title: 'Отложить на 10 мин',
        callback_data: genResponseRemindCallback(schedule.id, 10),
      },
      {
        title: 'Отложить на 30 мин',
        callback_data: genResponseRemindCallback(schedule.id, 30),
      },
    ];
    await this.telegramService.sendMessage(user.telegram_id, message, buttons);
  }
}
