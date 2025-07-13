import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsString, Length } from 'class-validator';

import { EValidationErrorMessages } from 'src/common/enums/message.enum';

export class SendOtpDto {
  @ApiProperty()
  @IsMobilePhone(
    'fa-IR',
    {},
    { message: EValidationErrorMessages.InvalidPhoneNumber },
  )
  phone: string;
}

export class CheckOtpDto {
  @ApiProperty()
  @IsMobilePhone(
    'fa-IR',
    {},
    { message: EValidationErrorMessages.InvalidPhoneNumber },
  )
  phone: string;

  @ApiProperty()
  @IsString()
  @Length(6, 6, { message: EValidationErrorMessages.InvalidAuthCode })
  code: string;
}
