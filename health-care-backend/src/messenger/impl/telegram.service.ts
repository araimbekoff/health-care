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
}

export const CBQ: Record<string, CallbackAttr> = {
  view_patient_treatments: {
    mess: 'Введите номер телефона пациента в формате +77774041000',
  },
  add_patient_treatments: {
    mess: 'Введите рекомендацию к лечению',
  },
};

@Injectable()
export class TelegramService {
  protected readonly bot: Telegraf<Context>;
  protected callbackQueryMap: Record<number, string> = {};

  // protected readonly observers: AbstractTelegramObserver[] = [];

  constructor(
    private configService: ConfigService,
    readonly messengerIdManagerService: IdManagerMessengerService,
    readonly treatmentService: TreatmentService,
  ) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.bot = new Telegraf<TgContext>(token);
    this.init().then(() => console.log('telegram initialized'));
    this.bot.launch().then(() => console.log('telegram launched'));
  }

  private async getUser(ctx: TgContext) {
    const { update } = ctx;
    const { message } = update;
    const { from } = message;
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
      const user = await this.getUser(ctx);
      if (!user) {
        return;
      }
      if ('contact' in ctx.message) {
        this.receiveContact(ctx)
          .then(() => console.log('registered'))
          .catch((e) => console.log('registering failed', e));
      } else if (this.callbackQueryMap[ctx.from.id]) {
        this.execCallbackQueryRequest(this.callbackQueryMap[ctx.from.id], ctx)
          .then(() => console.log('execCallbackQueryRequest'))
          .catch((e) => console.log('execCallbackQueryRequest', e));
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

  async execCallbackQueryRequest(callbackQuery: string, ctx: TgContext) {
    const mess = this.extractTextMessage(ctx);
    if (!mess) {
      this.callbackQueryHandler(ctx, callbackQuery).then(() => console.log(''));
      return;
    }
    //
    this.treatmentService
      .saveFromRawText(
        mess,
        (treatment: number | TreatmentEntity, report: string) => {
          ctx.reply(`Рекомендации успешно добавлены: \n ${report}`);
        },
        (e: Error) => {},
      )
      .then(() => console.log('OK'))
      .catch((e) => {
        ctx.reply(`Ошибка обработки: ${e.message}`);
        this.callbackQueryHandler(ctx, callbackQuery);
      });
    ctx.reply(
      'Ваш запрос обрабатывается. Вы получите сообщение о результатах обраотки',
    );
    delete this.callbackQueryMap[ctx.from.id];
  }

  async callbackQueryHandler(
    ctx: CQContext | TgContext,
    callbackQuery: string,
  ) {
    this.callbackQueryMap[ctx.from.id] = callbackQuery;
    const cbqItem = CBQ[callbackQuery];
    if (!cbqItem) {
      ctx.reply('Неизвестная коменда').then(() => console.log(''));
      return;
    }
    ctx.reply(cbqItem.mess).then(() => console.log(''));
  }

  async replyToStart(user: UserEntity, ctx: TgContext) {
    await ctx.sendMessage(
      'Выберите функцию',
      Markup.inlineKeyboard(
        [
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
}
