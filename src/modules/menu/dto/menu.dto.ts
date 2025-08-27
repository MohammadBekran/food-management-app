import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsUUID, Length } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty()
  @Length(2, 20)
  name: string;

  @ApiProperty({ format: 'binary' })
  image: string;

  @ApiProperty()
  price: string;

  @ApiPropertyOptional()
  discount: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
  @IsUUID()
  groupId: string;
}

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}

export class FindMenusParamDto {
  @ApiProperty()
  @IsUUID()
  supplierId: string;
}

export class FindMenuParamDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
