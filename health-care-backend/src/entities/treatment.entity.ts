import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('treatment')
export class TreatmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'rec_date' })
  rec_date: Date;

  @Column({ name: 'is_actual' })
  is_actual: boolean;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'medications_raw', type: 'text' })
  medications_raw: string;

  @Column({ name: 'procedures_raw', type: 'text' })
  procedures_raw: string;

  @Column({ name: 'exercises_raw', type: 'text' })
  exercises_raw: string;
}
