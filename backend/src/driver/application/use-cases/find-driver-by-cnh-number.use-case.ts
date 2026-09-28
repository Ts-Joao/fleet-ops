import { DriverNotFoundError } from '@driver/domain/errors/driver-not-found.error';
import { DriverRepository } from '@driver/domain/ports/driver-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
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
