import { Cnh } from 'src/driver/domain/value-object/cnh';
import { Driver } from 'src/driver/domain/entities/driver';
import { RegisterDriverInput } from '../dto/register-drive.input';
import { DriverRepository } from 'src/driver/domain/ports/driver-repository';

export class RegisterDriverUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  execute(input: RegisterDriverInput) {
    const cnh = Cnh.create(
      input.cnh.number,
      input.cnh.issueDate,
      input.cnh.expiryDate,
      input.cnh.categories,
      input.cnh.restrictions,
      input.cnh.status,
    );

    const driver = Driver.create(
      input.id,
      input.name,
      input.birthDate,
      cnh,
    );

    return this.driverRepository.save(driver);
  }
}