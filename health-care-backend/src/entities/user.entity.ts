import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name' })
  full_name: string;

  @Column({ name: 'phone' })
  phone: string;

  @Column()
  gender: string;

  @Column()
  birthday: Date;

  @Column()
  address: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'emergency_contact_id' })
  emergency_contact: UserEntity;

  @Column()
  emergency_contact_id: number;
}
