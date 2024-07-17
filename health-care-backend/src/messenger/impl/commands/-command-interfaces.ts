import { Context } from 'telegraf';
// import { Message, Update } from 'telegraf/typings/core/types/typegram';
import { UserInfoDto } from '../../../id-manager/id-manager.messenger.service';

// export type TgContext = Context & { update: Update.MessageUpdate<Message> };
// export type CQContext = Context & { update: Update.CallbackQueryUpdate };

export abstract class TgCommandHandler {
  readonly class_name;

  constructor(class_name: string) {
    this.class_name = class_name;
  }

  abstract handle(ctx: Context): Promise<void>;

  abstract cmdCode(): string;

  abstract isCmdCode(callback_data: string): boolean;

  abstract cmdName(): string;

  abstract hasAccess(user_info: UserInfoDto): boolean;
}

export abstract class AwaitingInputCommand extends TgCommandHandler {
  abstract handleInput(
    mess: string,
    ctx: Context,
    user_info: UserInfoDto,
  ): Promise<void>;

  abstract inputMessage(): string;
}
