import {
  Body,
  Controller,
  Delete,
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
import { DeleteDriverUseCase } from 'src/driver/application/use-cases/delete-driver.use-case';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller('driver')
export class DriverController {
  constructor(
    private readonly registerDriverUseCase: RegisterDriverUseCase,
    private readonly findDriverByIdUseCase: FindDriverByIdUseCase,
    private readonly findDriverByCnhNumberUseCase: FindDriverByCnhNumberUseCase,
    private readonly searchDriversUseCase: SearchDriversUseCase,
    private readonly updateDriverUseCase: UpdateDriverUseCase,
    private readonly deleteDriverUseCase: DeleteDriverUseCase,
  ) {}

  @ApiOperation({
    summary: 'Register a new driver',
    description: 'Register a new driver in the system',
  })
  @ApiResponse({
    status: 201,
    description: 'Driver registered successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 409,
    description: 'Driver already exists',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() request: RegisterDriverRequest) {
    return this.registerDriverUseCase.execute(request);
  }

  @ApiOperation({
    summary: 'Search drivers',
    description: 'Search drivers by name and CNH categories',
  })
  @ApiResponse({
    status: 200,
    description: 'Drivers found successfully',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async search(
    @Query('name') name: string,
    @Query('cnhCategories') cnhCategories: CnhCategories[],
  ) {
    const filters: SearchDriverRequest = { name, cnhCategories }
    return this.searchDriversUseCase.execute(filters)
  }

  @ApiOperation({
    summary: 'Find driver by ID',
    description: 'Find driver by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Driver found successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Driver not found',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.findDriverByIdUseCase.execute(id);
  }

  @ApiOperation({
    summary: 'Find driver by CNH number',
    description: 'Find driver by CNH number',
  })
  @ApiResponse({
    status: 200,
    description: 'Driver found successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Driver not found',
  })
  @Get('cnh/:number')
  @HttpCode(HttpStatus.OK)
  async findByCnhNumber(@Param('number') number: string) {
    return this.findDriverByCnhNumberUseCase.execute(number);
  }

  @ApiOperation({
    summary: 'Update driver',
    description: 'Update driver',
  })
  @ApiResponse({
    status: 200,
    description: 'Driver updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Driver not found',
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() request: UpdateDriverRequest) {
    return this.updateDriverUseCase.execute({
      id,
      ...request
    });
  }

  @ApiOperation({
    summary: 'Delete driver',
    description: 'Delete driver',
  })
  @ApiResponse({
    status: 200,
    description: 'Driver deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Driver not found',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteDriverUseCase.execute(id);
  }
}
