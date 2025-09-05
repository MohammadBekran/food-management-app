import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
