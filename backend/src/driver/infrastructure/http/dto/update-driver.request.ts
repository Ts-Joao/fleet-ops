import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CnhCategories } from 'src/driver/domain/enums/cnh-category';
import { CnhRestrictions } from 'src/driver/domain/enums/cnh-restrictions';
import { CnhStatus } from 'src/driver/domain/enums/cnh-status';

export class UpdateDriverRequest {
  @IsString()
  @IsOptional()
  name?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  birthDate?: Date;

  @ValidateNested()
  @Type(() => UpdateCnhRequest)
  @IsOptional()
  cnh?: UpdateCnhRequest;
}

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
