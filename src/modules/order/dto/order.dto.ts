import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';

export class CancelOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 255)
  reason: string;
}
