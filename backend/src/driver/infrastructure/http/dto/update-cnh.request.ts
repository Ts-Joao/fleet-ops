import { CnhCategories } from '@driver/domain/enums/cnh-category';
import { CnhRestrictions } from '@driver/domain/enums/cnh-restrictions';
import { CnhStatus } from '@driver/domain/enums/cnh-status';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateCnhRequest {
  @IsString()
  @IsOptional()
  number?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  issueDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  expiryDate?: Date;

  @IsArray()
  @IsEnum(CnhCategories, { each: true })
  @IsOptional()
  categories?: CnhCategories[];

  @IsArray()
  @IsEnum(CnhRestrictions, { each: true })
  @IsOptional()
  restrictions?: CnhRestrictions[];

  @IsEnum(CnhStatus)
  @IsOptional()
  status?: CnhStatus;
}
