import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('health_state_entity')
export class HealthStateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column()
  last_visit_date: Date;

  @Column()
  special_notes: string;

  @Column()
  medical_history: string;

  @Column()
  blood__pressure: string;

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
