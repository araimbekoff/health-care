import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { UserEntity } from '../entities/user.entity';
import { HealthStateEntity } from '../entities/health.state.entity';
import { TreatmentEntity } from '../entities/treatment.entity';
import { TreatmentScheduleEntity } from '../entities/treatment.schedule.entity';
import * as process from 'node:process';
import { DataSource, DataSourceOptions } from 'typeorm';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';
import { join } from 'path';

config();

// Define DataSource options
const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [join(__dirname, '../**', '*.entity.{ts,js}')],
  synchronize: true,
};

// Create and initialize DataSource
const dataSource = new DataSource(dataSourceOptions);
addTransactionalDataSource(dataSource);

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        await dataSource.initialize();
        console.log('DataSource has been initialized');
        return {
          ...dataSourceOptions,
          autoLoadEntities: true,
        } as TypeOrmModuleOptions;
      },
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      HealthStateEntity,
      TreatmentEntity,
      TreatmentScheduleEntity,
    ]),
  ],
  providers: [
    {
      provide: DataSource,
      useValue: dataSource,
    },
  ],
  exports: [TypeOrmModule, DataSource],
})
export class DbCoreModule {
  constructor() {
    initializeTransactionalContext();
  }
}
