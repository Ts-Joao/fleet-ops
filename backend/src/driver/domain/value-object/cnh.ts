import { CnhCategories } from '../enums/cnh-category';
import { CnhRestrictions } from '../enums/cnh-restrictions';
import { CnhStatus } from '../enums/cnh-status';
import { InvalidCnhError } from '../errors/invalid-cnh.error';

export class Cnh {
  private constructor(
    private readonly number: string,
    private readonly issueDate: Date,
    private readonly expiryDate: Date,
    private readonly categories: CnhCategories[],
    private readonly restrictions: CnhRestrictions[],
    private readonly status: CnhStatus,
  ) {}

  public getCategories(): CnhCategories[] {
    return this.categories
  }

  public static create(
    number: string,
    issueDate: Date,
    expiryDate: Date,
    categories: CnhCategories[],
    restrictions: CnhRestrictions[],
    status: CnhStatus,
  ): Cnh {
    const cnh = new Cnh(
      number,
      issueDate,
      expiryDate,
      categories,
      restrictions,
      status
    );

    Cnh.validate(cnh);
    return cnh;
  }

  private static validate(cnh: Cnh): void {
    Cnh.validateNumber(cnh.number);
    Cnh.validateIssueDate(cnh.issueDate);
    Cnh.validateIsExpired(cnh.expiryDate);
    Cnh.validateCategories(cnh.categories);
    Cnh.validateRestrictions(cnh.restrictions);
    Cnh.validateStatus(cnh.status);
  }

  private static validateNumber(number: string): void {
    const regex = /^\d{11}$/;
    if (!regex.test(number)) {
      throw new InvalidCnhError('Invalid CNH number');
    }
  }

  private static validateDate(date: Date): void {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(date.toISOString().split('T')[0])) {
      throw new InvalidCnhError('Invalid CNH date');
    }
  }

  private static validateIssueDate(issueDate: Date): void {
    this.validateDate(issueDate);
    if (issueDate > new Date()) {
      throw new InvalidCnhError('Invalid CNH issue date');
    }
  }

  private static validateIsExpired(expiryDate: Date): void {
    this.validateDate(expiryDate);
    if (expiryDate < new Date()) {
      throw new InvalidCnhError('Invalid CNH expired');
    }
  }

  private static hasDuplicates<T>(items: T[], fieldName: string): void {
    const set = new Set(items);

    if (set.size !== items.length) {
      throw new InvalidCnhError(
        `Invalid CNH ${fieldName} has duplicate items`,
      );
    }
  }

  private static validateCategories(categories: CnhCategories[]): void {
    Cnh.hasDuplicates(categories, 'categories');

    for (const category of Object.values(CnhCategories)) {
      if (!categories.includes(category)) {
        throw new InvalidCnhError(`Invalid CNH category: ${category}`);
      }
    }
  }

  private static validateRestrictions(restrictions: CnhRestrictions[]): void {
    Cnh.hasDuplicates(restrictions, 'restrictions');

    for (const restriction of Object.values(CnhRestrictions)) {
      if (!restrictions.includes(restriction)) {
        throw new InvalidCnhError(`Invalid CNH restriction: ${restriction}`);
      }
    }
  }

  private static validateStatus(status: CnhStatus): void {
    this.validateIsSuspended(status);
    this.validateIsRevoked(status);
    this.validateIsExpiredStatus(status);
  }

  private static validateIsSuspended(status: CnhStatus): void {
    if (status === CnhStatus.SUSPENDED) {
      throw new InvalidCnhError('Invalid CNH suspended');
    }
  }

  private static validateIsRevoked(status: CnhStatus): void {
    if (status === CnhStatus.REVOKED) {
      throw new InvalidCnhError('Invalid CNH revoked');
    }
  }

  private static validateIsExpiredStatus(status: CnhStatus): void {
    if (status === CnhStatus.EXPIRED) {
      throw new InvalidCnhError('Invalid CNH expired');
    }
  }
}
