import { DomainError } from 'src/shared/domain/errors/domain-error';
import { DommainErrorType } from 'src/shared/domain/enums/domain-type-error';

export class CnhAlreadyExistsError extends DomainError {
  readonly code = 'CNH_ALREADY_EXISTS';
  readonly type = DommainErrorType.CONFLICT;

  constructor() {
    super('CNH already exists');
  }
}
