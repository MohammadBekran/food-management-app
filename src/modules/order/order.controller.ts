import { Controller, Get, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserAuth } from 'src/common/decorators/auth.decorator';
import { EApiTagNames } from 'src/common/enums/api-tag-name.enum';
import { EApiEndpointNames } from 'src/common/enums/api-endpoint.enum';
import { EControllerNames } from 'src/common/enums/controller-name.enum';

import { OrderService } from './order.service';
import { CancelOrderDto } from './dto/order.dto';

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
  cancelOrder(cancelOrderDto: CancelOrderDto) {}
}
