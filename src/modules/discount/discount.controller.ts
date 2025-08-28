import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { EApiTagNames } from 'src/common/enums/api-tag-name.enum';
import { EControllerNames } from 'src/common/enums/controller-name.enum';
import { EApiEndpointNames } from 'src/common/enums/api-endpoint.enum';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

import { DiscountService } from './discount.service';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto';

@Controller(EControllerNames.Discount)
@ApiTags(EApiTagNames.Discount)
export class DiscountController {
  constructor(private discountService: DiscountService) {}

  @Post(EApiEndpointNames.POSTCreateDiscount)
  @ApiConsumes(ESwaggerConsumes.URLEncoded, ESwaggerConsumes.JSON)
  async create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }

  @Put(EApiEndpointNames.PUTUpdateDiscount)
  @ApiConsumes(ESwaggerConsumes.URLEncoded, ESwaggerConsumes.JSON)
  async update(
    @Param('code') code: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    return this.discountService.update(code, updateDiscountDto);
  }

  @Delete(EApiEndpointNames.GETFindDiscounts)
  async delete() {
    return this.discountService.delete();
  }

  @Get(EApiEndpointNames.DELETEDiscount)
  async findAll() {
    return this.discountService.findAll();
  }
}
