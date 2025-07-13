import { Body, Controller, Post } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { EApiEndpointNames } from 'src/common/enums/api-endpoint.enum';
import { EApiTagNames } from 'src/common/enums/api-tag-name.enum';
import { EControllerNames } from 'src/common/enums/controller-name.enum';

import { AuthService } from './auth.service';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

import { SendOtpDto, CheckOtpDto } from './dto/otp.dto';

@Controller(EControllerNames.Auth)
@ApiTags(EApiTagNames.Auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(EApiEndpointNames.POSTSendOtp)
  @ApiConsumes(ESwaggerConsumes.JSON, ESwaggerConsumes.URLEncoded)
  sendOtp(@Body() otpDto: SendOtpDto) {
    return this.authService.sendOtp(otpDto);
  }

  @Post(EApiEndpointNames.POSTCheckOtp)
  @ApiConsumes(ESwaggerConsumes.JSON, ESwaggerConsumes.URLEncoded)
  checkOtp(@Body() otpDto: CheckOtpDto) {
    return this.authService.checkOtp(otpDto);
  }
}
