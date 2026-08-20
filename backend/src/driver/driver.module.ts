import { Module } from '@nestjs/common';
import { DriverController } from './infrastructure/http/controller/driver.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverEntity } from './infrastructure/persistence/entities/driver.entity';
import { RegisterDriverUseCase } from './application/use-cases/register-driver.use-case';
import { TypeOrmDriverRepository } from './infrastructure/persistence/repositories/typeorm-driver.repository';
import { DriverRepository } from './domain/ports/driver-repository';
import { DeleteDriverUseCase } from './application/use-cases/delete-driver.use-case';
import { UpdateDriverUseCase } from './application/use-cases/update-driver.use-case';
import { FindDriverByIdUseCase } from './application/use-cases/find-driver-by-id.use-case';
import { SearchDriversUseCase } from './application/use-cases/search-drivers.use-case';
import { FindDriverByCnhNumberUseCase } from './application/use-cases/find-driver-by-cnh-number.use-case';
import { CnhEntity } from './infrastructure/persistence/entities/cnh.entity';
import { UuidGenerator } from '@shared/infrastructure/id/uuid-generator';
import { IdGenerator } from '@shared/application/ports/id-generator.port';

@Module({
  imports: [TypeOrmModule.forFeature([DriverEntity, CnhEntity])],
  controllers: [DriverController],
  providers: [
    RegisterDriverUseCase,
    SearchDriversUseCase,
    FindDriverByIdUseCase,
    FindDriverByCnhNumberUseCase,
    UpdateDriverUseCase,
    DeleteDriverUseCase,
    TypeOrmDriverRepository,
    {
      provide: DriverRepository,
      useExisting: TypeOrmDriverRepository,
    },
    {
      provide: IdGenerator,
      useClass: UuidGenerator
    }
  ],
})
export class DriverModule {}
