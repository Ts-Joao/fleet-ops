import { CnhCategories } from 'src/driver/domain/enums/cnh-category';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class SearchDriverRequest {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsEnum(CnhCategories, { each: true })
  cnhCategories?: CnhCategories[]
}