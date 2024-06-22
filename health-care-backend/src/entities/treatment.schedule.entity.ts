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
  MEDICATION = 'medication',
  PROCEDURE = 'procedure',
  EXERCISE = 'exercise',
}

@Entity('treatment_schedule')
export class TreatmentScheduleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
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

  @Column()
  send_error: string;

  @Column({
    type: 'enum',
    enum: ScheduleType,
  })
  type: ScheduleType;
}
