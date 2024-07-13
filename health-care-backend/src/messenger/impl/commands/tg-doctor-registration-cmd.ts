import { Injectable } from '@nestjs/common';
import { AwaitingInputCommand } from './-command-interfaces';
import { UserInfoDto } from '../../../id-manager/id-manager.messenger.service';
import { TreatmentService } from '../../../treatment/treatment.service';
import { Context } from 'telegraf';

@Injectable()
export class TgDoctorRegistrationCmd implements AwaitingInputCommand {
  constructor(private readonly treatmentService: TreatmentService) {}

  async handle(ctx: Context): Promise<void> {
    await ctx.reply(this.inputMessage());
  }

  async handleInput(ctx: Context): Promise<void> {}

  cmdCode(): string {
    return 'registering_doctor';
  }

  cmdName(): string {
    return 'Зарегистрировать врача';
  }

  inputMessage(): string {
    return 'Введите ФИО, ИИН, номер телефона врача и БИН мед организации';
  }

  isCmdCode(callback_data: string) {
    return this.cmdCode() === callback_data;
  }

  hasAccess(user_info: UserInfoDto) {
    return user_info.is_superuser;
  }
}
