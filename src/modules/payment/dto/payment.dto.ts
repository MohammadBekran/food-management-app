import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentDto {
  @ApiProperty()
  addressId: number;

  @ApiPropertyOptional()
  description?: string;
}
