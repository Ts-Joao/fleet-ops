import { Driver } from 'src/driver/domain/entities/driver';
import { DriverNotFoundError } from 'src/driver/domain/errors/driver-not-found.error';
import { DriverRepository } from 'src/driver/domain/ports/driver-repository';

export class FindDriverByIdUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  async execute(id: string): Promise<Driver | null> {
    const driver = await this.driverRepository.findById(id);

    if (!driver) {
      throw new DriverNotFoundError();
    }

    return driver;
  }
}
