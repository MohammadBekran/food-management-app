import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { EApiEndpointNames } from 'src/common/enums/api-endpoint.enum';
import { EApiTagNames } from 'src/common/enums/api-tag-name.enum';
import { EControllerNames } from 'src/common/enums/controller-name.enum';
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

  @Delete(EApiEndpointNames.DELETEDiscount)
  async delete(@Param('code') code: string) {
    return this.discountService.delete(code);
  }

  @Get(EApiEndpointNames.GETFindDiscounts)
  @Pagination()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.discountService.findAll(paginationDto);
  }
}
