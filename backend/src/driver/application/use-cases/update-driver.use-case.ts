import { DriverRepository } from 'src/driver/domain/ports/driver-repository'
import { UpdateDriverInput } from '../dto/update-driver.input'
import { Driver } from 'src/driver/domain/entities/driver'
import { DriverNotFoundError } from 'src/driver/domain/errors/driver-not-found.error'
import { Cnh } from 'src/driver/domain/value-object/cnh'

export class UpdateDriverUseCase {
  constructor(private readonly repository: DriverRepository) {}

  async execute(input: UpdateDriverInput): Promise<Driver> {
    const driver = await this.repository.findById(input.id)

    if (!driver) {
      throw new DriverNotFoundError();
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
