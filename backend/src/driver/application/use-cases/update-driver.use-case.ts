import { DriverRepository } from '@driver/domain/ports/driver-repository'
import { UpdateDriverInput } from '../dto/update-driver.input'
import { Driver } from '@driver/domain/entities/driver'
import { DriverNotFoundError } from '@driver/domain/errors/driver-not-found.error'
import { Cnh } from '@driver/domain/value-object/cnh'
import { CnhAlreadyExistsError } from '@driver/domain/errors/cnh-already-exist.error'
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateDriverUseCase {
  constructor(private readonly repository: DriverRepository) {}

  async execute(input: UpdateDriverInput): Promise<Driver> {
    const driver = await this.repository.findById(input.id)
    if (!driver) {
      throw new DriverNotFoundError();
    }

    if (input.cnh?.number !== driver.getCnh().getNumber()) {
      const cnhNumberExists = await this.repository.findByCnhNumber(input.cnh?.number ?? '')

      if (cnhNumberExists) {
        throw new CnhAlreadyExistsError();
      }

    }

    if (input.name !== undefined) {
      driver.changeName(input.name);
    }

    if (input.birthDate !== undefined) {
      driver.changeBirthDate(input.birthDate);
    }

    if (input.cnh !== undefined) {
      const cnh = Cnh.create(
        input.cnh.number ?? driver.getCnh().getNumber(),
        input.cnh.issueDate ?? driver.getCnh().getIssueDate(),
        input.cnh.expiryDate ?? driver.getCnh().getExpiryDate(),
        input.cnh.categories ?? driver.getCnh().getCategories(),
        input.cnh.restrictions ?? driver.getCnh().getRestrictions(),
        input.cnh.status ?? driver.getCnh().getStatus(),
      );

      driver.changeCnh(cnh);
    }

    return await this.repository.save(driver);
  }
}
