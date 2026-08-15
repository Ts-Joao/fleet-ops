import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RegisterDriverUseCase } from 'src/driver/application/use-cases/register-driver.use-case';
import { FindDriverByIdUseCase } from 'src/driver/application/use-cases/find-driver-by-id.use-case';
import { FindDriverByCnhNumberUseCase } from 'src/driver/application/use-cases/find-driver-by-cnh-number.use-case';
import { SearchDriversUseCase } from 'src/driver/application/use-cases/search-drivers.use-case';
import { RegisterDriverRequest } from '../dto/register-driver.request';
import { SearchDriverRequest } from '../dto/search-driver.request';
import { CnhCategories } from 'src/driver/domain/enums/cnh-category';
import { UpdateDriverRequest } from '../dto/update-driver.request';
import { UpdateDriverUseCase } from 'src/driver/application/use-cases/update-driver.use-case';

@Controller('driver')
export class DriverController {
  constructor(
    private readonly registerDriverUseCase: RegisterDriverUseCase,
    private readonly findDriverByIdUseCase: FindDriverByIdUseCase,
    private readonly findDriverByCnhNumberUseCase: FindDriverByCnhNumberUseCase,
    private readonly searchDriversUseCase: SearchDriversUseCase,
    private readonly updateDriverUseCase: UpdateDriverUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() request: RegisterDriverRequest) {
    return this.registerDriverUseCase.execute(request);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async search(
    @Query('name') name: string,
    @Query('cnhCategories') cnhCategories: CnhCategories[],
  ) {
    const filters: SearchDriverRequest = { name, cnhCategories }
    return this.searchDriversUseCase.execute(filters)
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

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() request: UpdateDriverRequest) {
    return this.updateDriverUseCase.execute({
      id,
      ...request
    });
  }
}
