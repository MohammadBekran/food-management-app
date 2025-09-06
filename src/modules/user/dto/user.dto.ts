import { IsEnum, IsOptional, Length } from 'class-validator';

import { EOrderStatus } from 'src/modules/order/enums/status.enum';

export class GetUserOrdersDto {
  @IsOptional()
  @IsEnum(EOrderStatus)
  status: EOrderStatus;

  @IsOptional()
  @Length(1, 50)
  search?: string;
}
