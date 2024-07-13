import { Injectable } from '@nestjs/common';
import { AwaitingInputCommand } from './-command-interfaces';
import { TreatmentService } from '../../../treatment/treatment.service';
import { UserInfoDto } from '../../../id-manager/id-manager.messenger.service';
import { Context } from 'telegraf';

@Injectable()
export class TgAddPatientTreatmentsCmd implements AwaitingInputCommand {
  constructor(private readonly treatmentService: TreatmentService) {}

  async handle(ctx: Context): Promise<void> {
    await ctx.reply(this.inputMessage());
  }

  async handleInput(ctx: Context): Promise<void> {
    if ('text' in ctx.message) {
      try {
        const treatment = await this.treatmentService.saveFromRawText(
          ctx.message.text,
        );
        const report = TreatmentService.genReport(treatment);
        await ctx.reply(`Рекомендации успешно добавлены: \n ${report}`);
      } catch (e) {
        console.error(e);
        await ctx.reply(e.message);
      }
    }
  }

  cmdCode(): string {
    return 'add_patient_treatments';
  }

  cmdName(): string {
    return 'Добавить рекомендации пациенту';
  }

  inputMessage(): string {
    return 'Введите рекомендацию к лечению';
  }

  isCmdCode(callback_data: string) {
    return this.cmdCode() === callback_data;
  }

  hasAccess(user_info: UserInfoDto) {
    const clinics = user_info.clinics || [];
    return user_info.is_superuser || clinics.length > 0;
  }
}
