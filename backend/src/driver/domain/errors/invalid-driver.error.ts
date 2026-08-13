import { DomainError } from 'src/shared/domain/errors/domain-error';

export class InvalidDriverError extends DomainError {
  readonly code = 'INVALID_DRIVER';

  constructor(message: string) {
    super(message);
  }
}