import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateDiscountDto {
  @ApiProperty()
  code: string;

  @ApiPropertyOptional()
  percent: number;

  @ApiPropertyOptional()
  amount: number;

  @ApiPropertyOptional()
  limit: number;

  @ApiPropertyOptional()
  expires_in: Date;
}

export class UpdateDiscountDto extends PartialType(CreateDiscountDto) {}
