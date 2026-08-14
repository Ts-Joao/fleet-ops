import { DriverNotFoundError } from 'src/driver/domain/errors/driver-not-found.error';
import { DriverRepository } from 'src/driver/domain/ports/driver-repository';

export class FindDriverByCnhNumberUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  async execute(cnhNumber: string) {
    const driver = await this.driverRepository.findByCnhNumber(cnhNumber);

    if (!driver) {
      throw new DriverNotFoundError();
    }

    return driver;
  }
}
