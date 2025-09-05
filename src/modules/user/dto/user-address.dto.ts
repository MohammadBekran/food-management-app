import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateUserAddressDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  province: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  address: string;

  @ApiPropertyOptional()
  postal_code?: string;
}

export class UpdateUserAddressDto extends PartialType(CreateUserAddressDto) {}
