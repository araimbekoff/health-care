import { Injectable } from '@nestjs/common';
import { AwaitingInputCommand } from './-command-interfaces';
import { UserInfoDto } from '../../../id-manager/id-manager.messenger.service';
import { TreatmentService } from '../../../treatment/treatment.service';
import { Context } from 'telegraf';
import { IdManagerClinicService } from '../../../id-manager/id-manager.clinic.service';
import { TelegramService } from '../telegram.service';
import { OpenaiService } from '../../../openai/openai.service';

@Injectable()
export class TgDoctorRegistrationCmd extends AwaitingInputCommand {
  constructor(
    private readonly idManagerClinicService: IdManagerClinicService,
    private readonly openaiService: OpenaiService,
  ) {
    super(TgDoctorRegistrationCmd.name);
  }

  async handle(ctx: Context): Promise<void> {
    await ctx.reply(this.inputMessage());
  }

  async handleInput(
    mess: string,
    ctx: Context,
    user_info: UserInfoDto,
  ): Promise<void> {
    const { clinics, is_superuser } = user_info;
    if (!is_superuser && !(clinics || []).length) {
      await ctx.reply('У вас нет прав на регистрацию врача');
    }
  }

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
