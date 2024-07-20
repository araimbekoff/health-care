export interface DoctorDto {
  fullName: string;

  specialization: string;

  clinic: string;

  appointmentDate: string;
}

export interface PatientDto {
  fullName: string;

  dateOfBirth: string;

  gender: string;

  phone: string;
  email: string;
  address: string;
}

export interface EmergencyContactDto {
  name: string;

  relation: string;

  phone: string;
}

export interface PreviousMedicationDto {
  name: string;

  dosage: string;

  duration: string;

  reason: string;
}

export interface PreviousProcedureDto {
  name: string;

  date: string;

  reason: string;
}

export interface AnamnesisDto {
  previousMedications: PreviousMedicationDto[];

  chronicDiseases: string[];

  allergies: string[];

  previousProcedures: PreviousProcedureDto[];

  additionalInfo?: string;
}

export interface HealthMetricDto {
  category: string;

  name: string;

  value: string;

  unit?: string;

  date?: string;

  description?: string;
}

export interface DiagnosisDto {
  type: string;
  description: string;

  code?: string;
}

export interface MedicationRecommendationDto {
  name: string;

  tradeName: string;

  frequency: string;

  courseDuration: string;

  dosage: string;

  administrationMethod: string;

  additionalInstructions?: string;
}

export enum OtherRecommendationType {
  Exercise = 'exercise',
  Procedure = 'procedure',
}

export interface OtherRecommendationDto {
  type: OtherRecommendationType;

  name: string;

  frequency: string;

  courseDuration: string;

  additionalInstructions?: string;
}

export interface RecommendationsDto {
  medication: MedicationRecommendationDto[];

  other: OtherRecommendationDto[];
}

export interface ReferralDto {
  specialist: string;

  reason: string;
}

export interface MedicalReportDto {
  doctor: DoctorDto;

  patient: PatientDto;

  emergency_contact: EmergencyContactDto;

  complaints: string[];

  anamnesis: AnamnesisDto;

  healthMetrics: HealthMetricDto[];

  diagnoses: DiagnosisDto[];

  recommendations: RecommendationsDto;

  referrals: ReferralDto[];

  nextAppointment: string;

  additionalNotes?: string;
}
