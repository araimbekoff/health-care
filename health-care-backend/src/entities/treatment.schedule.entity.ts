import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { TreatmentEntity } from './treatment.entity';

export enum ScheduleType {
  MEDICATION = 'medications',
  PROCEDURE = 'procedures',
  EXERCISE = 'exercises',
}

@Entity('treatment_schedule')
export class TreatmentScheduleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TreatmentEntity)
  @JoinColumn({ name: 'treatment_id' })
  treatment: TreatmentEntity;

  @Column({ type: 'timestamp' })
  send_date: Date;

  @Column()
  treatment_id: number;

  @Column()
  message_ctx: string;

  @Column({ nullable: true })
  is_sent: boolean;

  @Column({ nullable: true })
  send_error: string;

  @Column({
    type: 'enum',
    enum: ScheduleType,
  })
  type: ScheduleType;
}
