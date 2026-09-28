import { CnhCategories } from '@driver/domain/enums/cnh-category';
import { CnhRestrictions } from '@driver/domain/enums/cnh-restrictions';
import { CnhStatus } from '@driver/domain/enums/cnh-status';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class RegisterCnhRequest {
  @ApiProperty({
    example: '12345678901',
  })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({
    example: new Date('2025-01-01'),
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  issueDate: Date;

  @ApiProperty({
    example: new Date('2028-01-01'),
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  expiryDate: Date;

  @ApiProperty({
    enum: CnhCategories,
    example: [CnhCategories.A, CnhCategories.D],
  })
  @IsArray()
  @IsEnum(CnhCategories, { each: true })
  categories: CnhCategories[];

  @ApiProperty({
    enum: CnhRestrictions,
    example: [],
  })
  @IsArray()
  @IsEnum(CnhRestrictions, { each: true })
  restrictions: CnhRestrictions[];

  @ApiProperty({
    enum: CnhStatus,
    example: CnhStatus.ACTIVE,
  })
  @IsEnum(CnhStatus)
  status: CnhStatus;
}
