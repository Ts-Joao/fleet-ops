import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, FindOptionsWhere, ILike, Raw, Repository } from 'typeorm';
import { Driver } from 'src/driver/domain/entities/driver';
import { DriverRepository, DriverSearchFilters } from 'src/driver/domain/ports/driver-repository';
import { DriverEntity } from '@driver/infrastructure/persistence/entities/driver.entity';
import { DriverMapper } from '../mappers/driver.mapper';

@Injectable()
export class TypeOrmDriverRepository implements DriverRepository {
  constructor(
    @InjectRepository(DriverEntity)
    private readonly repository: Repository<DriverEntity>,
  ) {}

  async save(driver: Driver): Promise<Driver> {
    const existingEntity = await this.repository.findOne({
      where: { id: driver.getId() },
      relations: { cnh: true },
    });

    const entity = DriverMapper.toEntity(driver, existingEntity?.cnh?.id);

    const savedEntity = await this.repository.save(entity);

    if (!savedEntity.cnh && existingEntity?.cnh) {
      savedEntity.cnh = existingEntity.cnh;
    }

    return DriverMapper.toDomain(savedEntity);
  }

  async findMany(filters: DriverSearchFilters): Promise<Driver[]> {
    const query = this.repository
      .createQueryBuilder('driver')
      .leftJoinAndSelect('driver.cnh', 'cnh');

    if (filters?.name) {
      query.andWhere('driver.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    if (filters?.cnhCategories && filters.cnhCategories.length > 0) {
      query.andWhere('cnh.categories::jsonb @> :categories::jsonb', {
        categories: JSON.stringify(filters.cnhCategories),
      });
    }

    const entities = await query.getMany();

    return entities.map((entity) => DriverMapper.toDomain(entity));
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
      where: { cnh: { number: cnhNumber } },
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
