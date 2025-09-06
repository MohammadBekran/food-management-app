import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsIdentityCard,
  IsOptional,
  IsPhoneNumber,
  IsUUID,
  Length,
} from 'class-validator';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  EOrderItemStatus,
  EOrderStatus,
} from 'src/modules/order/enums/status.enum';

export class SupplierSignupDto {
  @ApiProperty()
  @Length(3, 20)
  first_name: string;

  @ApiProperty()
  @Length(3, 20)
  last_name: string;

  @ApiProperty()
  @IsPhoneNumber('IR')
  phone: string;

  @ApiProperty()
  @Length(2, 20)
  city: string;

  @ApiProperty()
  @Length(3, 20)
  store_name: string;

  @ApiPropertyOptional()
  invite_code: string;

  @ApiProperty()
  @IsUUID()
  categoryId: string;
}

export class SupplementaryInformationDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsIdentityCard('IR')
  national_code: string;
}

export class UploadDocumentsDto {
  @ApiProperty({ format: 'binary' })
  acceptedDocument: string;

  @ApiProperty({ format: 'binary' })
  image: string;
}

export class UploadContractDto {
  @ApiProperty({ format: 'binary' })
  contract: string;
}

export class GetSupplierOrdersDto extends PaginationDto {
  @ApiPropertyOptional({ enum: EOrderStatus })
  @IsOptional()
  @IsEnum(EOrderStatus)
  status: EOrderStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 50)
  search?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: EOrderItemStatus })
  @IsEnum(EOrderItemStatus)
  status: EOrderItemStatus;
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

  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 50)
  city: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 50)
  store_name: string;
}
