import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Context, Markup, Telegraf } from 'telegraf';
import { IdManagerMessengerService } from '../../id-manager/id-manager.messenger.service';
import { Update, Message } from 'telegraf/typings/core/types/typegram';
import { Contact } from '@telegraf/types/message';
import { UserEntity } from '../../entities/user.entity';
import { TreatmentService } from '../../treatment/treatment.service';
import { TreatmentEntity } from '../../entities/treatment.entity';

export type TgContext = Context & {
  update: Update.MessageUpdate<Message>;
};
export type CQContext = Context & {
  update: Update.CallbackQueryUpdate;
};

class CallbackAttr {
  name?: string;
  mess?: string;
  request_text: boolean;
}

export const CBQ: Record<string, CallbackAttr> = {
  view_my_treatments: {
    mess: '',
    request_text: false,
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

@Injectable()
export class TelegramService {
  protected readonly bot: Telegraf<Context>;
  protected callbackQueryMap: Record<number, string> = {};

  // protected readonly observers: AbstractTelegramObserver[] = [];

  constructor(
    private configService: ConfigService,
    private readonly messengerIdManagerService: IdManagerMessengerService,
    private readonly treatmentService: TreatmentService,
  ) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.bot = new Telegraf<TgContext>(token);
    this.init().then(() => console.log('telegram initialized'));
    this.bot.launch().then(() => console.log('telegram launched'));
  }

  private async getUser(ctx: TgContext | CQContext) {
    const { from } = ctx;
    const user = await this.messengerIdManagerService.getUserByTelegram(from);
    if (!user) {
      await ctx.reply('Для продолжения отправьте номер телефона', {
        reply_markup: {
          one_time_keyboard: true,
          keyboard: [
            [{ text: 'отправить номер телефона', request_contact: true }],
          ],
        },
      });
      return null;
    }
    return user;
  }

  async init() {
    this.bot.command('start', async (ctx: TgContext) => {
      const user = await this.getUser(ctx);
      if (user) {
        this.replyToStart(user, ctx).then().catch();
      }
    });

    this.bot.on('message', async (ctx: TgContext) => {
      // if (!user) {
      //   return;
      // }
      if ('contact' in ctx.message) {
        this.receiveContact(ctx)
          .then(() => console.log('registered'))
          .catch((e) => console.log('registering failed', e));
        return;
      }
      const user = await this.getUser(ctx);

      if (this.callbackQueryMap[ctx.from.id]) {
        this.execCallbackQueryRequest(this.callbackQueryMap[ctx.from.id], ctx);
        // .then(() => console.log('execCallbackQueryRequest_'))
        // .catch((e) => console.log('execCallbackQueryRequest_', e));
      } else {
        ctx.reply('Мы не смогли обработать ваш запрос.');
        this.replyToStart(user, ctx).then().catch();
      }
    });
    this.bot.on('callback_query', (ctx: CQContext) => {
      const { callbackQuery } = ctx;
      if ('data' in callbackQuery) {
        const { data } = callbackQuery;
        this.callbackQueryHandler(ctx, data);
      }
    });
  }

  private extractTextMessage(ctx: TgContext) {
    if (ctx.update && ctx.update.message && 'text' in ctx.update.message) {
      return ctx.update.message.text;
    }
    return null;
  }

  execCallbackQueryRequest(callbackQuery: string, ctx: TgContext) {
    const mess = this.extractTextMessage(ctx);
    if (!mess || !CBQ[callbackQuery]) {
      this.callbackQueryHandler(ctx, callbackQuery).then(() => console.log(''));
      return;
    }
    //
    if (callbackQuery === 'add_patient_treatments') {
      this.treatmentService
        .saveFromRawText(
          mess,
          async (treatment: number | TreatmentEntity, report: string) => {
            await ctx.reply(`Рекомендации успешно добавлены: \n ${report}`, {
              parse_mode: 'MarkdownV2',
            });
          },
          async (e: Error) => {
            await ctx.reply(`Ошибка обработки: ${e.message}`);
          },
        )
        .catch(async (e) => {
          await ctx.reply(`Ошибка обработки: ${e.message}`, {
            parse_mode: 'MarkdownV2',
          });
          await this.callbackQueryHandler(ctx, callbackQuery);
        });
    } else if (callbackQuery === 'view_patient_treatments') {
      this.treatmentService.loadReportByPhone(mess).then((rep) => {
        ctx.reply(rep, { parse_mode: 'MarkdownV2' });
      });
    }
    ctx.reply(
      'Ваш запрос обрабатывается. Вы получите сообщение о результатах обраотки',
    );
    delete this.callbackQueryMap[ctx.from.id];
  }

  async callbackQueryHandler(
    ctx: CQContext | TgContext,
    callbackQuery: string,
  ) {
    const cbqItem = CBQ[callbackQuery];
    if (!cbqItem) {
      ctx.reply('Неизвестная коменда').then(() => console.log(''));
      this.callbackQueryMap[ctx.from.id] = null;
      return;
    } else if (callbackQuery === 'view_my_treatments') {
      const telegram_id = ctx.from.id;
      console.log('telegram_id', telegram_id);
      const user = await this.getUser(ctx);
      const rep = await this.treatmentService.loadReportByPhone(user.phone);
      ctx.reply(rep, { parse_mode: 'MarkdownV2' });
    }
    if (cbqItem.request_text) {
      this.callbackQueryMap[ctx.from.id] = callbackQuery;
      ctx.reply(cbqItem.mess).then(() => console.log(''));
    }
  }

  async replyToStart(user: UserEntity, ctx: TgContext) {
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

  async receiveContact(ctx: TgContext) {
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

  async sendMessage(telegram_id: string, message: string) {
    await this.bot.telegram.sendMessage(telegram_id, message);
  }
}
