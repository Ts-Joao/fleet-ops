import { Module } from '@nestjs/common';
import { DriverController } from './infrastructure/http/controller/driver.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverEntity } from './infrastructure/persistence/enities/driver.entity';
import { RegisterDriverUseCase } from './application/use-cases/register-driver.use-case';
import { TypeOrmDriverRepository } from './infrastructure/persistence/repositories/typeorm-driver.repository';
import { DriverRepository } from './domain/ports/driver-repository';

@Module({
  imports: [TypeOrmModule.forFeature([DriverEntity])],
  controllers: [DriverController],
  providers: [
    RegisterDriverUseCase,
    TypeOrmDriverRepository,
    {
      provide: DriverRepository,
      useExisting: TypeOrmDriverRepository,
    },
  ],
})
export class DriverModule {}
