import { CnhCategories } from '@driver/domain/enums/cnh-category';
import { InvalidDriverError } from '@driver/domain/errors/invalid-driver.error';
import { Cnh } from '@driver/domain/value-object/cnh';

export class Driver {
  private constructor(
    private readonly id: string,
    private name: string,
    private birthDate: Date,
    private cnh: Cnh,
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

  public changeName(name: string): void {
    Driver.validateName(name);
    this.name = name;
  }

  public changeBirthDate(birthDate: Date): void {
    Driver.validateAge(birthDate, this.cnh);
    this.birthDate = birthDate;
  }

  public changeCnh(cnh: Cnh): void {
    Driver.validateHasCnh(cnh);
    Driver.validateAge(this.birthDate, cnh);
    this.cnh = cnh;
  }

  private static validate(driver: Driver): void {
    Driver.validateId(driver.id);
    Driver.validateName(driver.name);
    Driver.validateHasCnh(driver.cnh);
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

  public static calculateDriverAge(birthDate: Date): number {
    const currentDate = new Date();

    if (birthDate > currentDate) {
      throw new InvalidDriverError('Driver birth date is invalid');
    }

    if (Number.isNaN(birthDate.getTime())) {
      throw new InvalidDriverError(
        'Driver birth date is invalid',
      );
    }

    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();

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

  private static validateHasCnh(cnh: Cnh): void {
    if (!cnh) {
      throw new InvalidDriverError('CNH is required');
    }
  }
}