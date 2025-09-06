import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  Length,
} from 'class-validator';

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

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 50)
  first_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 50)
  last_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber('IR')
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;
}
