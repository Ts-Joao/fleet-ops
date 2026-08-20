import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { DriverNotFoundError } from 'src/driver/domain/errors/driver-not-found.error';
import { InvalidCnhError } from 'src/driver/domain/errors/invalid-cnh.error';
import { InvalidDriverError } from 'src/driver/domain/errors/invalid-driver.error';
import { DomainError } from 'src/shared/domain/errors/domain-error';
import { Response } from 'express';
import { DommainErrorType } from 'src/shared/domain/enums/domain-type-error';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter<DomainError> {
  private readonly statusByType: Record<DommainErrorType, HttpStatus> = {
    [DommainErrorType.INVALID]: HttpStatus.BAD_REQUEST,
    [DommainErrorType.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [DommainErrorType.CONFLICT]: HttpStatus.CONFLICT,
  }

  catch(exception: DomainError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = this.statusByType[exception.type] ?? HttpStatus.BAD_REQUEST
    
    response.status(status).json({
      statusCode: status,
      code: exception.code,
      message: exception.message,
    })
  }
} 