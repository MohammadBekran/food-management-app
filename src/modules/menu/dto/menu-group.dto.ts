import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class CreateMenuGroupDto {
  @ApiProperty()
  @Length(3, 20)
  title: string;
}

export class UpdateMenuGroupDto extends PartialType(CreateMenuGroupDto) {}
