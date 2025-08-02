import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIdentityCard } from 'class-validator';

export class SupplierSignupDto {
  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  store_name: string;

  @ApiProperty()
  invite_code: string;

  @ApiProperty()
  categoryId: string;
}

export class SupplementaryInformationDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsIdentityCard()
  national_code: string;
}
