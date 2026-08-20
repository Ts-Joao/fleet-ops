import { CnhCategories } from 'src/driver/domain/enums/cnh-category';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SearchDriverRequest {
  @ApiPropertyOptional({
    example: 'João da Silva',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({
    example: [CnhCategories.A, CnhCategories.D],
    enum: CnhCategories,
    isArray: true,
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (typeof value === 'string') return value.split(',');
    return value;
  })
  @IsArray()
  @IsEnum(CnhCategories, { each: true })
  cnhCategories?: CnhCategories[]
}