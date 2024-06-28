// telegram.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Context, Markup, Telegraf } from 'telegraf';
import { IdManagerMessengerService } from '../../id-manager/id-manager.messenger.service';
import { Update, Message } from 'telegraf/typings/core/types/typegram';
import { Contact } from '@telegraf/types/message';
import { UserEntity } from '../../entities/user.entity';
import { TreatmentService } from '../../treatment/treatment.service';
import { TreatmentEntity } from '../../entities/treatment.entity';
import {
  isScheduleResponse,
  TreatmentScheduleResponseDto,
} from '../dto/messenger-dtos';

export type TgContext = Context & { update: Update.MessageUpdate<Message> };
export type CQContext = Context & { update: Update.CallbackQueryUpdate };

@Injectable()
export class TelegramService {
  private readonly bot: Telegraf<Context>;
  private readonly callbackQueryMap: Record<number, string> = {};

  constructor(
    private readonly configService: ConfigService,
    private readonly messengerIdManagerService: IdManagerMessengerService,
    private readonly treatmentService: TreatmentService,
  ) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.bot = new Telegraf<TgContext>(token);

    this.init()
      .then(() => console.log('Telegram initialized'))
      .catch(console.error);

    this.bot
      .launch()
      .then(() => console.log('Telegram launched'))
      .catch(console.error);
  }

  private async getUser(
    ctx: TgContext | CQContext,
  ): Promise<UserEntity | null> {
    const user = await this.messengerIdManagerService.getUserByTelegram(
      ctx.from,
    );
    if (!user) {
      await ctx.reply('Для продолжения отправьте номер телефона', {
        reply_markup: {
          one_time_keyboard: true,
          keyboard: [
            [{ text: 'Отправить номер телефона', request_contact: true }],
          ],
        },
      });
    }
    return user;
  }

  private async init(): Promise<void> {
    this.bot.command('start', async (ctx: TgContext) => {
      const user = await this.getUser(ctx);
      if (user) await this.replyToStart(user, ctx);
    });

    this.bot.on('message', async (ctx: TgContext) => {
      if ('contact' in ctx.message) {
        await this.receiveContact(ctx);
        return;
      }

      const user = await this.getUser(ctx);
      if (!user) return;

      const callbackQuery = this.callbackQueryMap[ctx.from.id];
      if (callbackQuery) {
        await this.execCallbackQueryRequest(callbackQuery, ctx);
      } else {
        await ctx.reply('Мы не смогли обработать ваш запрос.');
        await this.replyToStart(user, ctx);
      }
    });

    this.bot.on('callback_query', async (ctx: CQContext) => {
      if ('data' in ctx.callbackQuery) {
        const { data } = ctx.callbackQuery;
        await this.callbackQueryHandler(ctx, data);
      }
    });
  }

  private extractTextMessage(ctx: TgContext): string | null {
    if (ctx.update && ctx.update.message && 'text' in ctx.update.message) {
      return ctx.update.message.text;
    }
  }

  private async execCallbackQueryRequest(
    callbackQuery: string,
    ctx: TgContext,
  ): Promise<void> {
    const mess = this.extractTextMessage(ctx);
    if (!mess || !CBQ[callbackQuery]) {
      await this.callbackQueryHandler(ctx, callbackQuery);
      return;
    }

    switch (callbackQuery) {
      case 'add_patient_treatments':
        await this.treatmentService.saveFromRawText(
          mess,
          async (treatment: number | TreatmentEntity, report: string) => {
            await ctx.reply(`Рекомендации успешно добавлены: \n${report}`, {
              parse_mode: 'MarkdownV2',
            });
          },
          async (e: Error) => {
            await ctx.reply(`Ошибка обработки: ${e.message}`);
          },
        );
        break;

      case 'view_patient_treatments':
        const report = await this.treatmentService.loadReportByPhone(mess);
        await ctx.reply(report, { parse_mode: 'MarkdownV2' });
        break;

      default:
        await ctx.reply(
          'Ваш запрос обрабатывается. Вы получите сообщение о результатах обработки',
        );
    }

    delete this.callbackQueryMap[ctx.from.id];
  }

  private async callbackQueryHandler(
    ctx: CQContext | TgContext,
    callbackQuery: string,
  ): Promise<void> {
    if (isScheduleResponse(callbackQuery)) {
      this.callbackQueryMap[ctx.from.id] = null;
      return;
    }
    const cbqItem = CBQ[callbackQuery];
    if (!cbqItem) {
      await ctx.reply('Неизвестная команда');
      this.callbackQueryMap[ctx.from.id] = null;
      return;
    }

    switch (callbackQuery) {
      case 'view_my_treatments':
        const user = await this.getUser(ctx);
        if (user) {
          const report = await this.treatmentService.loadReportByPhone(
            user.phone,
          );
          await ctx.reply(report, { parse_mode: 'MarkdownV2' });
        }
        break;

      default:
        if (cbqItem.request_text) {
          this.callbackQueryMap[ctx.from.id] = callbackQuery;
          await ctx.reply(cbqItem.mess);
        }
    }
  }

  private async replyToStart(user: UserEntity, ctx: TgContext): Promise<void> {
    await ctx.sendMessage(
      'Выберите функцию',
      Markup.inlineKeyboard(
        [
          Markup.button.callback('Мои рекомендации', 'view_my_treatments'),
          Markup.button.callback(
            'Найти рекомендации пациенту',
            'view_patient_treatments',
          ),
          Markup.button.callback(
            'Добавить рекомендации пациенту',
            'add_patient_treatments',
          ),
        ],
        { columns: 1 },
      ),
    );
  }

  private async receiveContact(ctx: TgContext): Promise<void> {
    try {
      if ('contact' in ctx.message) {
        const contact: Contact = ctx.message.contact;
        await this.messengerIdManagerService.saveTelegramContact(contact);
        await ctx.reply(
          'Вы успешно зарегистрированы.\nНажмите на /start чтобы продолжить...',
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  async sendMessage(
    telegram_id: string,
    message: string,
    buttons: TreatmentScheduleResponseDto[],
  ): Promise<void> {
    const inline_buttons = buttons.map((btn) =>
      Markup.button.callback(btn.title, btn.callback_data),
    );
    const inline_keyboard = inline_buttons.length
      ? Markup.inlineKeyboard(inline_buttons, { columns: 1 })
      : undefined;
    await this.bot.telegram.sendMessage(telegram_id, message, inline_keyboard);
  }
}

class CallbackAttr {
  name?: string;
  mess?: string;
  request_text = false;
}

export const CBQ: Record<string, CallbackAttr> = {
  view_my_treatments: {
    mess: 'Посмотреть мои рекомендации от врача',
    request_text: true,
  },
  view_patient_treatments: {
    mess: 'Введите номер телефона пациента в формате +77774041000',
    request_text: true,
  },
  add_patient_treatments: {
    mess: 'Введите рекомендацию к лечению',
    request_text: true,
  },
};
