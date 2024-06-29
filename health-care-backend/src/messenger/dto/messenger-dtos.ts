export const isScheduleResponse = (query: string) => {
  const responseTypes = Object.values(ScheduleResponseType);
  return responseTypes.some((type) => query.startsWith(type));
};

export class ScheduleResponseDto {
  type: ScheduleResponseType;
  schedule_id: number;
  remind_after_min: number;
}

export const parseScheduleResponse = (query: string): ScheduleResponseDto => {
  if (!isScheduleResponse(query)) {
    return null;
  }
  const responseTypes = Object.values(ScheduleResponseType);
  const type_ = responseTypes.find((type) => query.startsWith(type));
  const values_raw = query.replace(type_ + '-', '');
  if (type_ === ScheduleResponseType.RESPONSE) {
    return {
      type: type_,
      schedule_id: Number(values_raw),
      remind_after_min: 0,
    };
  } else if (type_ === ScheduleResponseType.REMIND_AFTER) {
    const a = values_raw.split('-');
    return {
      type: type_,
      schedule_id: Number(a[0]),
      remind_after_min: Number(a[1]),
    };
  }
  return null;
};

export const genResponseCallback = (schedule_id: number) => {
  return `${ScheduleResponseType.RESPONSE}-${schedule_id}`;
};
export const genResponseRemindCallback = (schedule_id: number, min: number) => {
  return `${ScheduleResponseType.REMIND_AFTER}-${schedule_id}-${min}`;
};

export enum ScheduleResponseType {
  RESPONSE = 'schedule_response',
  REMIND_AFTER = 'schedule_remind_after',
}

export class TreatmentScheduleResponseDto {
  title: string;
  callback_data: string;
}
