import { CnhCategories } from '@driver/domain/enums/cnh-category';
import { CnhRestrictions } from '@driver/domain/enums/cnh-restrictions';
import { CnhStatus } from '@driver/domain/enums/cnh-status';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class RegisterCnhRequest {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  issueDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  expiryDate: Date;

  @IsArray()
  @IsEnum(CnhCategories, { each: true })
  categories: CnhCategories[];

  @IsArray()
  @IsEnum(CnhRestrictions, { each: true })
  restrictions: CnhRestrictions[];

  @IsEnum(CnhStatus)
  status: CnhStatus;
}
