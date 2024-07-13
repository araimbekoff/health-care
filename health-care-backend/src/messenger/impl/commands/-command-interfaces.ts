import { Context } from 'telegraf';
// import { Message, Update } from 'telegraf/typings/core/types/typegram';
import { UserInfoDto } from '../../../id-manager/id-manager.messenger.service';

// export type TgContext = Context & { update: Update.MessageUpdate<Message> };
// export type CQContext = Context & { update: Update.CallbackQueryUpdate };

export interface TgCommandHandler {
  handle(ctx: Context): Promise<void>;

  cmdCode(): string;

  isCmdCode(callback_data: string): boolean;

  cmdName(): string;

  hasAccess(user_info: UserInfoDto): boolean;
}

export interface AwaitingInputCommand extends TgCommandHandler {
  handleInput(ctx: Context): Promise<void>;

  inputMessage(): string;
}
