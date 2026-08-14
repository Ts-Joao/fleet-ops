import { DommainErrorType } from 'src/shared/domain/enums/domain-type-error';
import { DomainError } from 'src/shared/domain/errors/domain-error';

export class DriverNotFoundError extends DomainError {
  readonly code = 'NOT_FOUND';
  readonly type = DommainErrorType.NOT_FOUND

  constructor() {
    super('Driver not Found');
  }
}