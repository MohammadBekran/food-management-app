import { Body, Controller, Post } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { EApiEndpointNames } from 'src/common/enums/api-endpoint.enum';
import { EApiTagNames } from 'src/common/enums/api-tag-name.enum';
import { EControllerNames } from 'src/common/enums/controller-name.enum';
import { UserAuth } from 'src/common/decorators/auth.decorator';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

import { PaymentService } from './payment.service';
import { PaymentDto } from './dto/payment.dto';

@Controller(EControllerNames.Payment)
@ApiTags(EApiTagNames.Payment)
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post(EApiEndpointNames.POSTPayment)
  @UserAuth()
  @ApiConsumes(ESwaggerConsumes.URLEncoded, ESwaggerConsumes.JSON)
  getGatewayUrl(@Body() paymentDto: PaymentDto) {
    return this.paymentService.getGatewayUrl(paymentDto);
  }
}
