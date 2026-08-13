import { DomainError } from 'src/shared/domain/errors/domain-error';

export class InvalidCnhError extends DomainError {
  readonly code = 'INVALID_CNH';

  constructor(message: string) {
    super(message);
  }
}