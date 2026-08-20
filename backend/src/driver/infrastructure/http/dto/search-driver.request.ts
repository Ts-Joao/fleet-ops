import { CnhCategories } from 'src/driver/domain/enums/cnh-category';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchDriverRequest {
  @ApiProperty({
    example: 'João da Silva',
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({
    example: [CnhCategories.A, CnhCategories.D],
  })
  @IsOptional()
  @IsEnum(CnhCategories, { each: true })
  cnhCategories?: CnhCategories[]
}