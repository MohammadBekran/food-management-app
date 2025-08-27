import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { EApiTagNames } from 'src/common/enums/api-tag-name.enum';
import { EControllerNames } from 'src/common/enums/controller-name.enum';

import { BasketService } from './basket.service';

@Controller(EControllerNames.Basket)
@ApiTags(EApiTagNames.Basket)
export class BasketController {
  constructor(private basketService: BasketService) {}
}
