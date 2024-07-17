import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PatientDto {
  @ApiProperty({ description: 'Полное имя пациента' })
  fullName: string;

  @ApiProperty({ description: 'Дата рождения пациента' })
  dateOfBirth: string;

  @ApiProperty({ description: 'Пол пациента' })
  gender: string;

  @ApiProperty({ description: 'Контактная информация пациента' })
  contacts: string;
}

export class EmergencyContactDto {
  @ApiProperty({ description: 'ФИО контактного лица' })
  name: string;

  @ApiProperty({ description: 'степень родства' })
  relation: string;

  @ApiProperty({ description: 'номер телефона' })
  phone: string;
}

export class AnthropometryDto {
  @ApiProperty({ description: 'Рост пациента' })
  height: string;

  @ApiProperty({ description: 'Вес пациента' })
  weight: string;

  @ApiProperty({ description: 'Индекс массы тела (ИМТ)' })
  bmi: string;

  @ApiProperty({ description: 'Окружность талии' })
  waistCircumference: string;
}

export class LifestyleDto {
  @ApiProperty({ description: 'Статус курения' })
  smokingStatus: string;

  @ApiProperty({ description: 'Уровень физической активности' })
  physicalActivityLevel: string;
}

export class BloodPressureDto {
  @ApiProperty({ description: 'Систолическое артериальное давление' })
  systolic: string;

  @ApiProperty({ description: 'Диастолическое артериальное давление' })
  diastolic: string;
}

export class VitalSignsDto {
  @ApiProperty({ type: BloodPressureDto })
  bloodPressure: BloodPressureDto;

  @ApiProperty({ description: 'Частота сердечных сокращений' })
  heartRate: string;

  @ApiProperty({ description: 'Частота дыхания' })
  respiratoryRate: string;

  @ApiProperty({ description: 'Насыщение крови кислородом (сатурация)' })
  oxygenSaturation: string;
}

export class LipidProfileDto {
  @ApiProperty({ description: 'Общий холестерин' })
  totalCholesterol: string;

  @ApiProperty({ description: 'Липопротеины низкой плотности' })
  ldl: string;

  @ApiProperty({ description: 'Липопротеины высокой плотности' })
  hdl: string;

  @ApiProperty({ description: 'Триглицериды' })
  triglycerides: string;
}

export class RenalFunctionDto {
  @ApiProperty({ description: 'Креатинин' })
  creatinine: string;

  @ApiProperty({ description: 'Микроальбуминурия' })
  microalbuminuria: string;
}

export class ElectrolytesDto {
  @ApiProperty({ description: 'Калий' })
  potassium: string;

  @ApiProperty({ description: 'Натрий' })
  sodium: string;
}

export class LaboratoryResultsDto {
  @ApiProperty({ description: 'Уровень глюкозы в крови натощак' })
  fastingBloodGlucose: string;

  @ApiProperty({ description: 'Гликированный гемоглобин' })
  hba1c: string;

  @ApiProperty({ type: LipidProfileDto })
  lipidProfile: LipidProfileDto;

  @ApiProperty({ type: RenalFunctionDto })
  renalFunction: RenalFunctionDto;

  @ApiProperty({ type: ElectrolytesDto })
  electrolytes: ElectrolytesDto;
}

export class PulmonaryFunctionDto {
  @ApiProperty({ description: 'Объем форсированного выдоха за 1 секунду' })
  fev1: string;

  @ApiProperty({ description: 'Форсированная жизненная емкость легких' })
  fvc: string;

  @ApiProperty({ description: 'Пиковая скорость выдоха' })
  peakExpiratoryFlow: string;
}

export class CardiacAssessmentDto {
  @ApiProperty({ description: 'Результаты ЭКГ' })
  ecgResults: string;
}

export class AsthmaControlDto {
  @ApiProperty({ description: 'Тип опросника (например, ACT или ACQ)' })
  questionnaireType: string;

  @ApiProperty({ description: 'Балл по опроснику' })
  score: string;
}

export class DiseaseSpecificInfoDto {
  @ApiProperty({ type: AsthmaControlDto })
  asthmaControl: AsthmaControlDto;

  @ApiProperty({ description: 'Частота использования ингалятора' })
  inhalerUseFrequency: string;

  @ApiProperty({ description: 'Частота обострений астмы' })
  asthmaExacerbationsFrequency: string;
}

export class HealthMetricsDto {
  @ApiProperty({ type: AnthropometryDto })
  anthropometry: AnthropometryDto;

  @ApiProperty({ type: LifestyleDto })
  lifestyle: LifestyleDto;

  @ApiProperty({ type: VitalSignsDto })
  vitalSigns: VitalSignsDto;

  @ApiProperty({ type: LaboratoryResultsDto })
  laboratoryResults: LaboratoryResultsDto;

  @ApiProperty({ type: PulmonaryFunctionDto })
  pulmonaryFunction: PulmonaryFunctionDto;

  @ApiProperty({ type: CardiacAssessmentDto })
  cardiacAssessment: CardiacAssessmentDto;

  @ApiProperty({ type: DiseaseSpecificInfoDto })
  diseaseSpecificInfo: DiseaseSpecificInfoDto;
}

export class DiagnosisDto {
  @ApiProperty({ description: 'Основной диагноз' })
  primary: string;

  @ApiPropertyOptional({ description: 'Вторичный диагноз' })
  secondary?: string;

  @ApiPropertyOptional({ description: 'Подозреваемый диагноз' })
  suspectedDiagnosis?: string;
}

export class PrescriptionDto {
  @ApiProperty({
    description: 'Тип назначения (лекарство/упражнение/процедура)',
  })
  type: string;

  @ApiProperty({ description: 'Название назначения' })
  name: string;

  @ApiPropertyOptional({ description: 'Форма (для лекарств)' })
  form?: string;

  @ApiProperty({ description: 'Дозировка' })
  dosage: string;

  @ApiProperty({ description: 'Частота приема/выполнения' })
  frequency: string;

  @ApiProperty({ description: 'Продолжительность' })
  duration: string;

  @ApiPropertyOptional({ description: 'Особые инструкции' })
  specialInstructions?: string;
}

export class ReferralDto {
  @ApiProperty({ description: 'Тип направления' })
  type: string;

  @ApiProperty({ description: 'Специалист, к которому направляется пациент' })
  specialist: string;

  @ApiProperty({ description: 'Причина направления' })
  reason: string;
}

export class MedicalReportDto {
  @ApiProperty({ type: PatientDto })
  patient: PatientDto;

  @ApiProperty({ type: EmergencyContactDto })
  emergency_contact: EmergencyContactDto;

  @ApiProperty({ type: HealthMetricsDto })
  healthMetrics: HealthMetricsDto;

  @ApiProperty({ type: DiagnosisDto })
  diagnosis: DiagnosisDto;

  @ApiProperty({ type: [PrescriptionDto] })
  prescriptions: PrescriptionDto[];

  @ApiProperty({ type: [ReferralDto] })
  referrals: ReferralDto[];

  @ApiProperty({ description: 'Дата и время следующего приема' })
  nextAppointment: string;
}
