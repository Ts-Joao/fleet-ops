import { DommainErrorType } from "../enums/domain-type-error";

export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly type: DommainErrorType

  protected constructor(message: string) {
    super(message);

    this.name = this.constructor.name;
  }
}