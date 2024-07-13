import { Injectable } from '@nestjs/common';
import { TelegramService } from '../telegram.service';
import { Context, Markup } from 'telegraf';
import { UserInfoDto } from '../../../id-manager/id-manager.messenger.service';

@Injectable()
export class TgStartCmd {
  telegramService: TelegramService;

  setTelegramService(service: TelegramService) {
    this.telegramService = service;
  }

  async handle(ctx: Context, user_info: UserInfoDto) {
    const { tg_cmd_map } = this.telegramService;
    console.log('==>');
    const buttons = Object.values(tg_cmd_map)
      .filter((it) => it.hasAccess(user_info))
      .map((it) => {
        return Markup.button.callback(it.cmdName(), it.cmdCode());
      });
    await ctx.reply(
      'Выберите функцию',
      Markup.inlineKeyboard(buttons, { columns: 1 }),
    );
  }
}
