import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Raw, Repository } from 'typeorm';
import { Driver } from 'src/driver/domain/entities/driver';
import { DriverRepository, DriverSearchFilters } from 'src/driver/domain/ports/driver-repository';
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

  async findMany(filters: DriverSearchFilters): Promise<Driver[]> {
    const where: FindOptionsWhere<DriverEntity> = {}

    if (filters.name) {
      where.name = ILike(`%${filters.name}%`)
    }

    if (filters.cnhCategories) {
      where.cnhCategories = Raw(
        (alias) => `${alias}:: jsonb @> :cnhCategories`,
        { cnhCategories: JSON.stringify(filters.cnhCategories) },
      );
    }

    const entities = await this.repository.find({
      where,
    });

    return entities.map(entity => DriverMapper.toDomain(entity));
  }

  async findById(id: string): Promise<Driver | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    return DriverMapper.toDomain(entity);
  }

  async findByCnhNumber(cnhNumber: string): Promise<Driver | null> {
    const entity = await this.repository.findOne({
      where: { cnhNumber },
    });

    if (!entity) {
      return null;
    }

    return DriverMapper.toDomain(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
