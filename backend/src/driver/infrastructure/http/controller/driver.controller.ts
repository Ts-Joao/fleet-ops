import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { RegisterDriverUseCase } from 'src/driver/application/use-cases/register-driver.use-case';
import { RegisterDriverRequest } from '../dto/register-driver.request';
import { FindDriverByIdUseCase } from 'src/driver/application/use-cases/find-driver-by-id.use-case';
import { FindDriverByCnhNumberUseCase } from 'src/driver/application/use-cases/find-driver-by-cnh-number.use-case';

@Controller('driver')
export class DriverController {
  constructor(
    private readonly registerDriverUseCase: RegisterDriverUseCase,
    private readonly findDriverByIdUseCase: FindDriverByIdUseCase,
    private readonly findDriverByCnhNumberUseCase: FindDriverByCnhNumberUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() request: RegisterDriverRequest) {
    return this.registerDriverUseCase.execute(request);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.findDriverByIdUseCase.execute(id);
  }

  @Get('cnh/:number')
  @HttpCode(HttpStatus.OK)
  async findByCnhNumber(@Param('number') number: string) {
    return this.findDriverByCnhNumberUseCase.execute(number);
  }
}
