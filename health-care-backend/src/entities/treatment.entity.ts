import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { DoctorEntity } from './doctor.entity';

export enum TreatmentType {
  AG = 'AG',
}

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

  @ManyToOne(() => DoctorEntity)
  @JoinColumn({ name: 'doctor_id' })
  doctor: DoctorEntity;

  @Column({ name: 'doctor_id' })
  doctor_id: number;

  @Column({
    type: 'enum',
    enum: TreatmentType,
  })
  type: TreatmentType;

  @Column({ name: 'raw_text', type: 'text', nullable: true })
  raw_text: string;

  @Column({ name: 'medications_json', type: 'text', nullable: true })
  medications_json: string;

  @Column({ name: 'procedures_json', type: 'text', nullable: true })
  procedures_json: string;

  @Column({ name: 'exercises_json', type: 'text', nullable: true })
  exercises_json: string;

  @Column({ name: 'medications_raw', type: 'text', nullable: true })
  medications_raw: string;

  @Column({ name: 'procedures_raw', type: 'text', nullable: true })
  procedures_raw: string;

  @Column({ name: 'exercises_raw', type: 'text', nullable: true })
  exercises_raw: string;

  compareEntities(other: TreatmentEntity): boolean {
    return (
      other &&
      this.type === other.type &&
      this.medications_raw === other.medications_raw &&
      this.procedures_raw === other.procedures_raw &&
      this.exercises_raw === other.exercises_raw
    );
  }
}
