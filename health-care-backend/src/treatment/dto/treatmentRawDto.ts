export class TreatmentRawFieldDto {
  field: string;
  title: string;
  value: string;
}

export class TreatmentRawDto {
  data: TreatmentRawFieldDto[];
}
