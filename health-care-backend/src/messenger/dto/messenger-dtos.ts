export const isScheduleResponse = (query: string) => {
  const responseTypes = Object.values(ScheduleResponseType);
  return responseTypes.some((type) => query.startsWith(type));
};

export enum ScheduleResponseType {
  RESPONSE = 'schedule_response',
  REMIND_AFTER = 'schedule_remind_after',
}

export class TreatmentScheduleResponseDto {
  title: string;
  callback_data: string;
}
