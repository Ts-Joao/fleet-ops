import { Cnh } from 'src/driver/domain/value-object/cnh';
import { Driver } from 'src/driver/domain/entities/driver';
import { IdGenerator } from 'src/shared/application/ports/id-generator.port';
import { RegisterDriverInput } from '../dto/register-drive.input';
import { DriverRepository } from 'src/driver/domain/ports/driver-repository';
import { CnhAlreadyExistsError } from 'src/driver/domain/errors/cnh-already-exist.error';

export class RegisterDriverUseCase {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(input: RegisterDriverInput) {
    const id = this.idGenerator.generate();
    const cnhAlreadyExists = await this.driverRepository.findByCnhNumber(
      input.cnh.number,
    );

    if (cnhAlreadyExists) {
      throw new CnhAlreadyExistsError();
    }

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
