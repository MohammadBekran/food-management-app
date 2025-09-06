import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, Length } from 'class-validator';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { EOrderStatus } from 'src/modules/order/enums/status.enum';

export class GetUserOrdersDto extends PaginationDto {
  @ApiPropertyOptional({ enum: EOrderStatus })
  @IsOptional()
  @IsEnum(EOrderStatus)
  status: EOrderStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 50)
  search?: string;
}
