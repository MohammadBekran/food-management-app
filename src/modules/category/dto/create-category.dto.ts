import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  show: boolean;

  @ApiProperty({ format: 'binary' })
  image: string;

  @ApiPropertyOptional()
  parentId: string;
}
