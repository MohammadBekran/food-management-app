import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { EApiTagNames } from 'src/common/enums/api-tag-name.enum';
import { EControllerNames } from 'src/common/enums/controller-name.enum';
import { DiscountService } from './discount.service';

@Controller(EControllerNames.Discount)
@ApiTags(EApiTagNames.Discount)
export class DiscountController {
  constructor(private discountService: DiscountService) {}
}
