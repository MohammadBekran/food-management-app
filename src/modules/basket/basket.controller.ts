import { Body, Controller, Post } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { UserAuth } from 'src/common/decorators/auth.decorator';
import { EApiEndpointNames } from 'src/common/enums/api-endpoint.enum';
import { EApiTagNames } from 'src/common/enums/api-tag-name.enum';
import { EControllerNames } from 'src/common/enums/controller-name.enum';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

import { BasketService } from './basket.service';
import { BasketDto } from './dto/basket.dto';

@Controller(EControllerNames.Basket)
@ApiTags(EApiTagNames.Basket)
@UserAuth()
export class BasketController {
  constructor(private basketService: BasketService) {}

  @Post(EApiEndpointNames.POSTAddToBasket)
  @ApiConsumes(ESwaggerConsumes.URLEncoded, ESwaggerConsumes.JSON)
  addToBasket(@Body() basketDto: BasketDto) {
    return this.basketService.addToBasket(basketDto);
  }
}
