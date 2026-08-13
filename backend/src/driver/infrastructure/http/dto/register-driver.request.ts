import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CnhCategories } from 'src/driver/domain/enums/cnh-category';
import { CnhRestrictions } from 'src/driver/domain/enums/cnh-restrictions';
import { CnhStatus } from 'src/driver/domain/enums/cnh-status';

export class RegisterDriverRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsDate()
  birthDate: Date;

  @ValidateNested()
  @Type(() => RegisterCnhRequest)
  cnh: RegisterCnhRequest;
}

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
