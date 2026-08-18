import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RegisterCnhRequest } from './register-cnh.request';

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
