import { Driver } from '@driver/domain/entities/driver';
import { Cnh } from '@driver/domain/value-object/cnh';
import { IdGenerator } from '@shared/application/ports/id-generator.port';
import { RegisterDriverInput } from '../dto/register-driver.input';
import { DriverRepository } from '@driver/domain/ports/driver-repository';
import { CnhAlreadyExistsError } from '@driver/domain/errors/cnh-already-exist.error';

export class RegisterDriverUseCase {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(input: RegisterDriverInput) {
    const cnhAlreadyExists = await this.driverRepository.findByCnhNumber(
      input.cnh.number,
    );

    if (cnhAlreadyExists) {
      throw new CnhAlreadyExistsError();
    }

    const id = this.idGenerator.generate();
    const cnh = Cnh.create(
      input.cnh.number,
      input.cnh.issueDate,
      input.cnh.expiryDate,
      input.cnh.categories,
      input.cnh.restrictions,
      input.cnh.status,
    );

    const driver = Driver.create(id, input.name, input.birthDate, cnh);

    return this.driverRepository.save(driver);
  }
}
