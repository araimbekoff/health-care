import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ClinicEntity } from './clinic.entity';

@Entity('doctor')
export class DoctorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => ClinicEntity)
  @JoinColumn({ name: 'clinic_id' })
  clinic: ClinicEntity;

  @Column({ name: 'clinic_id' })
  clinic_id: number;

  @Column()
  specialisation: string;
}
