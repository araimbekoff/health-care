import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { DoctorEntity } from './doctor.entity';

@Entity('health_state')
export class HealthStateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => DoctorEntity)
  @JoinColumn({ name: 'doctor_id' })
  doctor: DoctorEntity;

  @Column({ name: 'doctor_id' })
  doctor_id: number;

  @Column()
  last_visit_date: Date;

  @Column()
  special_notes: string;

  @Column()
  medical_history: string;

  @Column()
  blood_pressure: string;

  @Column()
  pulse: string;

  @Column()
  lab_results: string;

  @Column()
  patient_feedback: string;

  @Column()
  activity_level: string;

  @Column()
  psychological_state: string;

  @Column()
  lifestyle: string;

  @Column()
  treatment_adherence: string;
}
