import { DommainErrorType } from '@shared/domain/enums/domain-type-error';
import { DomainError } from '@shared/domain/errors/domain-error';

export class DriverNotFoundError extends DomainError {
  readonly code = 'DRIVER_NOT_FOUND';
  readonly type = DommainErrorType.NOT_FOUND

  constructor() {
    super('Driver not Found');
  }
}