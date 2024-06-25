import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum MessengerType {
  TELEGRAM = 'telegram',
  WHATSAPP = 'whatsapp',
  INSTAGRAM = 'instagram',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name' })
  full_name: string;

  @Column({ name: 'phone' })
  phone: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  telegram_id: string;

  @Column({ nullable: true })
  whatsapp_id: string;

  @Column({ nullable: true })
  instagram_id: string;

  @Column({ nullable: false, default: false })
  is_su: boolean;

  @Column({
    nullable: true,
    type: 'enum',
    enum: MessengerType,
  })
  default_messenger: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'emergency_contact_id' })
  emergency_contact: UserEntity;

  @Column({ nullable: true })
  emergency_contact_id: number;
}
