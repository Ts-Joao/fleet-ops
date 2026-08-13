import { DomainError } from "src/shared/domain/errors/domain-error";

export class InvalidCnhError extends DomainError {
  constructor(message: string) {
    super(message);

    this.name = 'InvalidCnhError';
  }
}