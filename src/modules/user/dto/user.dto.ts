import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, Length } from 'class-validator';

import { EOrderStatus } from 'src/modules/order/enums/status.enum';

export class GetUserOrdersDto {
  @ApiPropertyOptional({ enum: EOrderStatus })
  @IsOptional()
  @IsEnum(EOrderStatus)
  status: EOrderStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 50)
  search?: string;
}
