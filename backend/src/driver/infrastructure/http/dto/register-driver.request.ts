import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RegisterCnhRequest } from './register-cnh.request';
import { ApiProperty } from '@nestjs/swagger';
import { CnhCategories } from '@driver/domain/enums/cnh-category';
import { CnhStatus } from '@driver/domain/enums/cnh-status';

export class RegisterDriverRequest {
  @ApiProperty({
    example: 'João da Silva',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: new Date('1990-01-01'),
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birthDate: Date;

  @ApiProperty({
    example: {
      number: '12345678901',
      issueDate: new Date('2025-01-01'),
      expiryDate: new Date('2028-01-01'),
      categories: [CnhCategories.A, CnhCategories.D],
      restrictions: [],
      status: CnhStatus.ACTIVE,
    },
  })
  @ValidateNested()
  @Type(() => RegisterCnhRequest)
  cnh: RegisterCnhRequest;
}
