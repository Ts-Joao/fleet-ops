import { DriverRepository, DriverSearchFilters } from 'src/driver/domain/ports/driver-repository';

export class SearchDriversUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  async execute(filters: DriverSearchFilters) {
    return await this.driverRepository.findMany(filters)
  }
}