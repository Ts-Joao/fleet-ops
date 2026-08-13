import { InvalidDriverError } from '../errors/invalid-driver';
import { Cnh } from '../value-object/cnh';

export class Driver {
  private constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly birthDate: Date,
    private readonly cnh: Cnh,
  ) {}

  public static create(
    id: string,
    name: string,
    birthDate: Date,
    cnh: Cnh,
  ): Driver {
    const driver = new Driver(
      id,
      name,
      birthDate,
      cnh,
    );

    Driver.validate(driver);
    return driver;
  }

  private static validate(driver: Driver): void {
    Driver.validateId(driver.id);
    Driver.validateName(driver.name);
    Driver.validateAge(driver.birthDate);
    Driver.validateCnh(driver.cnh);
  }

  private static validateId(id: string): void {
    if (!id) {
      throw new InvalidDriverError('ID is required');
    }
  }

  private static validateName(name: string): void {
    if (!name) {
      throw new InvalidDriverError('Name is required');
    }
  }

  private static validateAge(birthDate: Date): void {
    const age = new Date().getFullYear() - birthDate.getFullYear();

    if (age < 18) {
      throw new InvalidDriverError('Invalid birth date');
    }
  }

  private static validateCnh(cnh: Cnh): void {
    if (!cnh) {
      throw new InvalidDriverError('CNH is required');
    }
  }
}