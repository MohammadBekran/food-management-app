import { Body, Controller, Post } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { SupplierAuth } from 'src/common/decorators/auth.decorator';
import { CheckOtpDto } from 'src/common/dto/otp.dto';
import { EApiEndpointNames } from 'src/common/enums/api-endpoint.enum';
import { EApiTagNames } from 'src/common/enums/api-tag-name.enum';
import { EControllerNames } from 'src/common/enums/controller-name.enum';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

import {
  SupplementaryInformationDto,
  SupplierSignupDto,
} from './dto/supplier.dto';
import { SupplierService } from './supplier.service';

@Controller(EControllerNames.Supplier)
@ApiTags(EApiTagNames.Supplier)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post(EApiEndpointNames.POSTSupplierSignup)
  @ApiConsumes(ESwaggerConsumes.URLEncoded, ESwaggerConsumes.JSON)
  signup(@Body() signupDto: SupplierSignupDto) {
    return this.supplierService.signup(signupDto);
  }

  @Post(EApiEndpointNames.POSTSupplierCheckOtp)
  @ApiConsumes(ESwaggerConsumes.URLEncoded, ESwaggerConsumes.JSON)
  checkOtp(@Body() checkOtpDto: CheckOtpDto) {
    return this.supplierService.checkOtp(checkOtpDto);
  }

  @Post(EApiEndpointNames.POSTSupplierSupplementaryInformation)
  @ApiConsumes(ESwaggerConsumes.URLEncoded, ESwaggerConsumes.JSON)
  @SupplierAuth()
  supplementaryInformationDto(
    @Body() supplementaryInformationDto: SupplementaryInformationDto,
  ) {
    return this.supplierService.saveSupplementaryInformation(
      supplementaryInformationDto,
    );
  }
}
