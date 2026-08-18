import { Type } from 'class-transformer';
import {
  IsDate,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateCnhRequest } from './update-cnh.request';

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
