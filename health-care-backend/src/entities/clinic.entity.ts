import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('clinic')
export class ClinicEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({})
  uin: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;
}
