import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class BasketDto {
  @ApiProperty()
  @IsUUID()
  foodId: string;
}
