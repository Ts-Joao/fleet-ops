import { CnhCategories } from '../enums/cnh-category';
import { InvalidDriverError } from '../errors/invalid-driver.error';
import { Cnh } from '../value-object/cnh';

export class Driver {
  private constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly birthDate: Date,
    private readonly cnh: Cnh,
  ) {}

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getBirthDate(): Date {
    return this.birthDate;
  }

  public getCnh(): Cnh {
    return this.cnh;
  }

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
    Driver.validateCnh(driver.cnh);
    Driver.validateAge(driver.birthDate, driver.cnh);
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

  private static validateAge(birthDate: Date, driverCnh: Cnh): void {
    const age = this.calculateDriverAge(birthDate);
    const twentyOneRequiredCategories = [CnhCategories.D, CnhCategories.E];
    const eighteenRequiredCategories = [CnhCategories.A, CnhCategories.B];

    if (twentyOneRequiredCategories.some(category => driverCnh.getCategories().includes(category))) {
      Driver.validateCnhCategories(age, 21);
    }

    if (driverCnh.getCategories().includes(CnhCategories.C)) {
      Driver.validateCnhCategories(age, 19);
    }

    if (eighteenRequiredCategories.some(category => driverCnh.getCategories().includes(category))) {
      Driver.validateCnhCategories(age, 18);
    }
  }

  private static calculateDriverAge(birthDate: Date): number {
    let age: number;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();

    if (birthDate > currentDate) {
      throw new InvalidDriverError('Driver birth date is invalid');
    }

    age = currentYear - birthYear;

    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
      age--;
    }

    return age;
  }

  private static validateCnhCategories(age: number, requiredAge: number): void {
    if (age < requiredAge) {
      throw new InvalidDriverError(`Invalid CNH categories - required age: ${requiredAge}`);
    }
  }

  private static validateCnh(cnh: Cnh): void {
    if (!cnh) {
      throw new InvalidDriverError('CNH is required');
    }
  }
}