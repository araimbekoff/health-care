import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TreatmentScheduleEntity } from './treatment.schedule.entity';

@Entity('treatment_response')
export class TreatmentResponseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TreatmentScheduleEntity)
  @JoinColumn({ name: 'schedule_id' })
  schedule: TreatmentScheduleEntity;

  @Column({ name: 'schedule_id' })
  schedule_id: number;

  @Column({ name: 'response_date' })
  response_date: Date;

  @Column({ type: 'text' })
  response_text: string;

  @Column({ type: 'text', nullable: true })
  response_media_url: string;
}