import { DomainError } from "src/shared/domain/errors/domain-error";

export class InvalidDriverError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidDriverError';
  }
}