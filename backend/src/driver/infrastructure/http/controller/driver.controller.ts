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

@Controller('driver')
export class DriverController {
  constructor(
    private readonly registerDriverUseCase: RegisterDriverUseCase,
    private readonly findDriverByIdUseCase: FindDriverByIdUseCase,
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
}
