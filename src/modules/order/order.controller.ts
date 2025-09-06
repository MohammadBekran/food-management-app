import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { UserAuth } from 'src/common/decorators/auth.decorator';
import { EApiEndpointNames } from 'src/common/enums/api-endpoint.enum';
import { EApiTagNames } from 'src/common/enums/api-tag-name.enum';
import { EControllerNames } from 'src/common/enums/controller-name.enum';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

import { CancelOrderDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller(EControllerNames.Order)
@ApiTags(EApiTagNames.Order)
@UserAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get(EApiEndpointNames.GETOrder)
  getOrder(@Param('id') id: string) {
    return this.orderService.getOne(id);
  }

  @Put(EApiEndpointNames.PUTCancelOrder)
  @ApiConsumes(ESwaggerConsumes.URLEncoded, ESwaggerConsumes.JSON)
  cancelOrder(@Param('id') id: string, @Body() cancelOrderDto: CancelOrderDto) {
    return this.orderService.cancelOrder(id, cancelOrderDto);
  }
}
