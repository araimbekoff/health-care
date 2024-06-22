import { Module } from '@nestjs/common';
import * as process from 'node:process';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { UserEntity } from '../entities/user.entity';
import { HealthStateEntity } from '../entities/health.state.entity';
import { TreatmentEntity } from '../entities/treatment.entity';

config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [join(__dirname, '../**', '*.entity.{ts,js}')],
      //
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UserEntity, HealthStateEntity, TreatmentEntity]),
  ],
  exports: [TypeOrmModule],
})
export class DbCoreModule {}
