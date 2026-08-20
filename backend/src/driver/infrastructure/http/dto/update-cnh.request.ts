import { CnhCategories } from '@driver/domain/enums/cnh-category';
import { CnhRestrictions } from '@driver/domain/enums/cnh-restrictions';
import { CnhStatus } from '@driver/domain/enums/cnh-status';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCnhRequest {
  @ApiProperty({
    example: '12345678901',
  })
  @IsString()
  @IsOptional()
  number?: string;

  @ApiProperty({
    example: new Date('2025-01-01'),
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  issueDate?: Date;

  @ApiProperty({
    example: new Date('2028-01-01'),
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  expiryDate?: Date;

  @ApiProperty({
    enum: CnhCategories,
    example: [CnhCategories.A, CnhCategories.D],
  })
  @IsArray()
  @IsEnum(CnhCategories, { each: true })
  @IsOptional()
  categories?: CnhCategories[];

  @ApiProperty({
    enum: CnhRestrictions,
    example: [],
  })
  @IsArray()
  @IsEnum(CnhRestrictions, { each: true })
  @IsOptional()
  restrictions?: CnhRestrictions[];

  @ApiProperty({
    enum: CnhStatus,
    example: CnhStatus.ACTIVE,
  })
  @IsEnum(CnhStatus)
  @IsOptional()
  status?: CnhStatus;
}
