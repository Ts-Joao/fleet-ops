import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { DriverNotFoundError } from 'src/driver/domain/errors/driver-not-found.error';
import { InvalidCnhError } from 'src/driver/domain/errors/invalid-cnh.error';
import { InvalidDriverError } from 'src/driver/domain/errors/invalid-driver.error';
import { DomainError } from 'src/shared/domain/errors/domain-error';
import { Response } from 'express';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter<DomainError> {
  catch(exception: DomainError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = this.getStatus(exception)
    
    response.status(status).json({
      statusCode: status,
      code: exception.code,
      message: exception.message,
    })
  }

  private getStatus(exception: DomainError) {
    if (exception instanceof InvalidCnhError) {
      return HttpStatus.BAD_REQUEST
    }

    if (exception instanceof InvalidDriverError) {
      return HttpStatus.BAD_REQUEST
    }

    if (exception instanceof DriverNotFoundError) {
      return HttpStatus.NOT_FOUND
    }
    
    return HttpStatus.INTERNAL_SERVER_ERROR
  }
} 