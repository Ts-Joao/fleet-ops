import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterDriverUseCase } from '../../../application/use-cases/register-driver.use-case';
import { RegisterDriverRequest } from '../dto/register-driver.request';

@Controller('driver')
export class DriverController {
  constructor(private readonly registerDriverUseCase: RegisterDriverUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() request: RegisterDriverRequest) {
    return this.registerDriverUseCase.execute(request);
  }
}
