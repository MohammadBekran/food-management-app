import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentDto {
  @ApiProperty()
  addressId: string;

  @ApiPropertyOptional()
  description?: string;
}

export class InitiatePaymentDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  orderId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  status: boolean;
}
