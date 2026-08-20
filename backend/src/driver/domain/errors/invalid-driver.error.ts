import { DommainErrorType } from '@shared/domain/enums/domain-type-error';
import { DomainError } from '@shared/domain/errors/domain-error';

export class InvalidDriverError extends DomainError {
  readonly code = 'INVALID_DRIVER';
  readonly type = DommainErrorType.INVALID

  constructor(message: string) {
    super(message);
  }
}