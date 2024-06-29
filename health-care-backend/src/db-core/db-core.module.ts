import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';
import { UserEntity } from '../entities/user.entity';
import { HealthStateEntity } from '../entities/health.state.entity';
import { TreatmentEntity } from '../entities/treatment.entity';
import { TreatmentScheduleEntity } from '../entities/treatment.schedule.entity';
import { TreatmentResponseEntity } from '../entities/treatment.response.entity';
import { ClinicEntity } from '../entities/clinic.entity';
import { DoctorEntity } from '../entities/doctor.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const options = getDataSourceOptions(configService);

        const dataSource = new DataSource(options);
        await dataSource.initialize();
        addTransactionalDataSource(dataSource);
        console.log('DataSource has been initialized');

        return {
          ...options,
          autoLoadEntities: true,
        } as TypeOrmModuleOptions;
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      HealthStateEntity,
      TreatmentEntity,
      TreatmentScheduleEntity,
      TreatmentResponseEntity,
      ClinicEntity,
      DoctorEntity,
    ]),
  ],
  providers: [
    {
      provide: DataSource,
      useFactory: (configService: ConfigService) =>
        new DataSource(getDataSourceOptions(configService)),
      inject: [ConfigService],
    },
  ],
  exports: [TypeOrmModule, DataSource],
})
export class DbCoreModule {
  constructor() {
    initializeTransactionalContext();
  }
}

function getDataSourceOptions(configService: ConfigService): DataSourceOptions {
  return {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: [
      UserEntity,
      HealthStateEntity,
      TreatmentEntity,
      TreatmentScheduleEntity,
      TreatmentResponseEntity,
      ClinicEntity,
      DoctorEntity,
    ],
    synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
  };
}
