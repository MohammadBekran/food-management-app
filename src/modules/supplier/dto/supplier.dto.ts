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

import { EOrderStatus } from 'src/modules/order/enums/status.enum';

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

export class GetSupplierOrdersDto {
  @ApiPropertyOptional({ enum: EOrderStatus })
  @IsOptional()
  @IsEnum(EOrderStatus)
  status: EOrderStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 50)
  search?: string;
}
