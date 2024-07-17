import { Injectable } from '@nestjs/common';
import { TgCommandHandler } from './-command-interfaces';
import { TreatmentService } from '../../../treatment/treatment.service';
import {
  IdManagerMessengerService,
  UserInfoDto,
} from '../../../id-manager/id-manager.messenger.service';
import { Context } from 'telegraf';

@Injectable()
export class TgViewMyTreatmentsCmd extends TgCommandHandler {
  constructor(
    private readonly treatmentService: TreatmentService,
    private readonly messengerIdManagerService: IdManagerMessengerService,
  ) {
    super(TgViewMyTreatmentsCmd.name);
  }

  async handle(ctx: Context): Promise<void> {
    const userInfo = await this.messengerIdManagerService.getUserByTelegram(
      ctx.from,
    );
    const user = userInfo.user;
    if (user) {
      const report = await this.treatmentService.loadReportByPhone(user.phone);
      await ctx.reply(report, { parse_mode: 'MarkdownV2' });
    } else {
      await ctx.reply('Пользователь не найден');
    }
  }

  cmdCode(): string {
    return 'view_my_treatments';
  }

  cmdName(): string {
    return 'Мои рекомендации';
  }

  isCmdCode(callback_data: string) {
    return this.cmdCode() === callback_data;
  }

  hasAccess(user_info: UserInfoDto) {
    return true;
  }
}
