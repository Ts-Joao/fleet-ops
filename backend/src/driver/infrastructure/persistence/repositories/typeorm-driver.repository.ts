import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from 'src/driver/domain/entities/driver';
import { DriverRepository } from 'src/driver/domain/ports/driver-repository';
import { DriverEntity } from '../enities/driver.entity';
import { DriverMapper } from '../mappers/driver.mapper';

@Injectable()
export class TypeOrmDriverRepository implements DriverRepository {
  constructor(
    @InjectRepository(DriverEntity)
    private readonly repository: Repository<DriverEntity>,
  ) {}

  async save(driver: Driver): Promise<Driver> {
    const entity = DriverMapper.toEntity(driver);
    const savedEntity = await this.repository.save(entity);

    return DriverMapper.toDomain(savedEntity);
  }

  async findById(id: string): Promise<Driver | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }
    return DriverMapper.toDomain(entity);
  }
}