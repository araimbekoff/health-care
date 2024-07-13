// telegram.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Context, Markup, Telegraf } from 'telegraf';
import {
  IdManagerMessengerService,
  UserInfoDto,
} from '../../id-manager/id-manager.messenger.service';
import { Update, Message } from 'telegraf/typings/core/types/typegram';
import { Contact } from '@telegraf/types/message';
import { TgMarkupButtonDto } from '../dto/messenger-dtos';
import { ScheduleResponseService } from '../../schedule-response/schedule-response.service';
import { ScheduleTaskService } from '../../schedule-task/schedule-task.service';
import { CustomLogger } from '../../logger/custom.logger';
import { TgViewMyTreatmentsCmd } from './commands/tg-view-my-treatments.cmd';
import { TgAddPatientTreatmentsCmd } from './commands/tg-add-patient-treatments.cmd';
import { TgDoctorRegistrationCmd } from './commands/tg-doctor-registration-cmd';
import {
  AwaitingInputCommand,
  TgCommandHandler,
} from './commands/-command-interfaces';
import { TgStartCmd } from './commands/tg-start.cmd';

export type TgContext = Context & { update: Update.MessageUpdate<Message> };
export type CQContext = Context & { update: Update.CallbackQueryUpdate };

@Injectable()
export class TelegramService {
  logger = new CustomLogger(TelegramService.name);
  private readonly bot: Telegraf<Context>;
  private scheduleTaskService: ScheduleTaskService;

  readonly tg_cmd_map: Record<string, TgCommandHandler | AwaitingInputCommand>;
  private readonly callbackQueryMap: Record<string, string> = {};

  registerScheduleTaskService(scheduleTaskService: ScheduleTaskService) {
    this.scheduleTaskService = scheduleTaskService;
  }

  constructor(
    private readonly tgStartCmd: TgStartCmd,
    private readonly configService: ConfigService,
    private readonly scheduleResponseService: ScheduleResponseService,
    private readonly messengerIdManagerService: IdManagerMessengerService,
    private readonly tgViewMyTreatmentsCmd: TgViewMyTreatmentsCmd,
    private readonly tgAddPatientTreatmentsCmd: TgAddPatientTreatmentsCmd,
    private readonly tgDoctorRegistrationCmd: TgDoctorRegistrationCmd,
  ) {
    this.bot = new Telegraf<TgContext>(
      this.configService.get<string>('TELEGRAM_BOT_TOKEN'),
    );
    this.tg_cmd_map = this.initCommands();
    this.tgStartCmd.setTelegramService(this);

    this.init_bot()
      .then(() => this.logger.log('Telegram initialized '))
      .catch(this.logger.error);

    this.bot
      .launch()
      .then(() => this.logger.log('Telegram launched'))
      .catch(this.logger.error);
  }

  private initCommands() {
    const m: Record<string, TgCommandHandler | AwaitingInputCommand> = {};
    m[this.tgViewMyTreatmentsCmd.cmdCode()] = this.tgViewMyTreatmentsCmd;
    m[this.tgAddPatientTreatmentsCmd.cmdCode()] =
      this.tgAddPatientTreatmentsCmd;
    m[this.tgDoctorRegistrationCmd.cmdCode()] = this.tgDoctorRegistrationCmd;
    return m;
  }

  private async getUser(ctx: Context): Promise<UserInfoDto | null> {
    const userInfo = await this.messengerIdManagerService.getUserByTelegram(
      ctx.from,
    );
    const user = userInfo.user;
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
    return userInfo;
  }

  private async init_bot(): Promise<void> {
    console.log('start _init');
    this.bot.command('start', this.tgOnStart.bind(this));
    //
    this.bot.on('message', this.tgOnMessage.bind(this));

    this.bot.on('callback_query', this.tgOnCallbackQuery.bind(this));
  }

  async tgOnMessage(ctx: Context) {
    if ('contact' in ctx.message) {
      await this.receiveContact(ctx);
      return;
    }
    const user_info = await this.getUser(ctx);
    await this.receiveMessage(ctx, user_info);
  }

  async tgOnStart(ctx: Context) {
    const userData = await this.getUser(ctx);
    await this.tgStartCmd.handle(ctx, userData);
  }

  async tgOnCallbackQuery(ctx: Context) {
    let data = '';
    if ('data' in ctx.callbackQuery) {
      data = ctx.callbackQuery.data;
    }
    let cmd: AwaitingInputCommand | TgCommandHandler = null;
    if (data in this.tg_cmd_map) {
      cmd = this.tg_cmd_map[data];
    }
    await cmd.handle(ctx);
    this.logger.log(`callbackQuery.data = ${data}`);
  }

  /******************************************************************************/
  /******************************************************************************/
  /******************************************************************************/

  /******************************************************************************/
  private extractTextMessage(ctx: TgContext): string | null {
    if (ctx.update && ctx.update.message && 'text' in ctx.update.message) {
      return ctx.update.message.text;
    }
  }

  private async receiveMessage(
    ctx: Context,
    user_info: UserInfoDto,
  ): Promise<void> {}

  private async callbackQueryHandler(
    ctx: Context,
    callbackQuery: string,
  ): Promise<void> {}

  private async execCallbackQueryRequest(
    callbackQuery: string,
    ctx: Context,
  ): Promise<void> {}

  private async receiveContact(ctx: Context): Promise<void> {
    try {
      if ('contact' in ctx.message) {
        const contact: Contact = ctx.message.contact;
        await this.messengerIdManagerService.saveTelegramContact(contact);
        await ctx.reply(
          'Вы успешно зарегистрированы.\nНажмите на /start чтобы продолжить...',
        );
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  async sendMessage(
    telegram_id: string,
    message: string,
    buttons: TgMarkupButtonDto[],
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
