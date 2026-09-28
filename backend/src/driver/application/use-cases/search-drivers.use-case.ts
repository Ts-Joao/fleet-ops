import { DriverRepository, DriverSearchFilters } from '@driver/domain/ports/driver-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchDriversUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  async execute(filters?: DriverSearchFilters) {
    return await this.driverRepository.findMany(filters)
  }
}