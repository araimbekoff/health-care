import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DoctorDto {
  @ApiProperty({ description: 'ФИО врача' })
  fullName: string;

  @ApiProperty({ description: 'Специализация врача' })
  specialization: string;

  @ApiProperty({ description: 'Название клиники' })
  clinic: string;

  @ApiProperty({ description: 'Дата приема в формате yyyy-mm-dd' })
  appointmentDate: string;
}

export class PatientDto {
  @ApiProperty({ description: 'Полное имя пациента' })
  fullName: string;

  @ApiProperty({ description: 'Дата рождения пациента' })
  dateOfBirth: string;

  @ApiProperty({ description: 'Пол пациента' })
  gender: string;

  @ApiProperty({ description: 'телефон' })
  phone: string;
  @ApiProperty({ description: 'емейл' })
  email: string;
  @ApiProperty({ description: 'Адрес проживания' })
  address: string;
}

export class EmergencyContactDto {
  @ApiProperty({ description: 'ФИО контактного лица' })
  name: string;

  @ApiProperty({ description: 'Степень родства' })
  relation: string;

  @ApiProperty({ description: 'Номер телефона' })
  phone: string;
}

export class PreviousMedicationDto {
  @ApiProperty({ description: 'Название препарата' })
  name: string;

  @ApiProperty({ description: 'Дозировка' })
  dosage: string;

  @ApiProperty({ description: 'Длительность приема' })
  duration: string;

  @ApiProperty({ description: 'Причина приема' })
  reason: string;
}

export class PreviousProcedureDto {
  @ApiProperty({ description: 'Название процедуры' })
  name: string;

  @ApiProperty({ description: 'Дата проведения в формате yyyy-mm-dd' })
  date: string;

  @ApiProperty({ description: 'Причина проведения' })
  reason: string;
}

export class AnamnesisDto {
  @ApiProperty({ type: () => [PreviousMedicationDto] })
  previousMedications: PreviousMedicationDto[];

  @ApiProperty({ type: [String], description: 'Хронические заболевания' })
  chronicDiseases: string[];

  @ApiProperty({ type: [String], description: 'Аллергии' })
  allergies: string[];

  @ApiProperty({ type: () => [PreviousProcedureDto] })
  previousProcedures: PreviousProcedureDto[];

  @ApiPropertyOptional({ description: 'Дополнительная информация из анамнеза' })
  additionalInfo?: string;
}

export class HealthMetricDto {
  @ApiProperty({ description: 'Категория показателя' })
  category: string;

  @ApiProperty({ description: 'Название показателя' })
  name: string;

  @ApiProperty({ description: 'Значение показателя' })
  value: string;

  @ApiPropertyOptional({ description: 'Единица измерения' })
  unit?: string;

  @ApiPropertyOptional({
    description: 'Дата измерения/анализа в формате yyyy-mm-dd',
  })
  date?: string;

  @ApiPropertyOptional({
    description: 'Дополнительное описание или интерпретация',
  })
  description?: string;
}

export class DiagnosisDto {
  @ApiProperty({
    description: 'Тип диагноза (основной, вторичный, подозреваемый)',
  })
  type: string;

  @ApiProperty({ description: 'Описание диагноза' })
  description: string;

  @ApiPropertyOptional({ description: 'Код по МКБ-10 (если применимо)' })
  code?: string;
}

export class MedicationRecommendationDto {
  @ApiProperty({ description: 'МНН медикамента' })
  name: string;

  @ApiProperty({ description: 'Торговое название медикамента' })
  tradeName: string;

  @ApiProperty({ description: 'Частота' })
  frequency: string;

  @ApiProperty({ description: 'Длительность курса лечения' })
  courseDuration: string;

  @ApiProperty({ description: 'Дозировка' })
  dosage: string;

  @ApiProperty({ description: 'Способ применения' })
  administrationMethod: string;

  @ApiPropertyOptional({ description: 'Дополнительные инструкции' })
  additionalInstructions?: string;
}

export enum OtherRecommendationType {
  Exercise = 'exercise',
  Procedure = 'procedure',
}

export class OtherRecommendationDto {
  @ApiProperty({
    enum: OtherRecommendationType,
    description: 'Тип рекомендации',
  })
  type: OtherRecommendationType;

  @ApiProperty({ description: 'Наименование' })
  name: string;

  @ApiProperty({ description: 'Частота' })
  frequency: string;

  @ApiProperty({ description: 'Длительность курса' })
  courseDuration: string;

  @ApiPropertyOptional({ description: 'Дополнительные инструкции' })
  additionalInstructions?: string;
}

export class RecommendationsDto {
  @ApiProperty({ type: () => [MedicationRecommendationDto] })
  medication: MedicationRecommendationDto[];

  @ApiProperty({ type: () => [OtherRecommendationDto] })
  other: OtherRecommendationDto[];
}

export class ReferralDto {
  @ApiProperty({ description: 'Специалист или отделение' })
  specialist: string;

  @ApiProperty({ description: 'Причина направления' })
  reason: string;
}

export class MedicalReportDto {
  @ApiProperty({ type: () => DoctorDto })
  doctor: DoctorDto;

  @ApiProperty({ type: () => PatientDto })
  patient: PatientDto;

  @ApiProperty({ type: () => EmergencyContactDto })
  emergency_contact: EmergencyContactDto;

  @ApiProperty({ description: 'Жалобы пациента', type: [String] })
  complaints: string[];

  @ApiProperty({ type: () => AnamnesisDto })
  anamnesis: AnamnesisDto;

  @ApiProperty({ type: () => [HealthMetricDto] })
  healthMetrics: HealthMetricDto[];

  @ApiProperty({ type: () => [DiagnosisDto] })
  diagnoses: DiagnosisDto[];

  @ApiProperty({ type: () => RecommendationsDto })
  recommendations: RecommendationsDto;

  @ApiProperty({ type: () => [ReferralDto] })
  referrals: ReferralDto[];

  @ApiProperty({ description: 'Дата следующего приема в формате yyyy-mm-dd' })
  nextAppointment: string;

  @ApiPropertyOptional({
    description: 'Дополнительные заметки или рекомендации',
  })
  additionalNotes?: string;
}
