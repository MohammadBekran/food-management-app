import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { IsNull, Not, Repository } from 'typeorm';
import type { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';

import {
  EBadRequestMessages,
  ENotFoundMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';

import { BasketDiscountDto, BasketDto } from './dto/basket.dto';
import { MenuService } from '../menu/services/menu.service';
import { UserBasketEntity } from './entities/basket.entity';
import { DiscountService } from '../discount/discount.service';

@Injectable()
export class BasketService {
  constructor(
    @Inject(REQUEST) private req: Request,
    private menuService: MenuService,

    @InjectRepository(UserBasketEntity)
    private userBasketRepository: Repository<UserBasketEntity>,

    private discountService: DiscountService,
  ) {}

  async addToBasket(basketDto: BasketDto) {
    const { id: userId } = this.req.user!;
    const { foodId } = basketDto;

    await this.menuService.getOne(foodId);

    let basketItem = await this.userBasketRepository.findOne({
      where: {
        userId,
        foodId,
      },
    });

    if (basketItem) {
      basketItem.count += 1;
    } else {
      basketItem = this.userBasketRepository.create({
        userId,
        foodId,
        count: 1,
      });
    }

    await this.userBasketRepository.save(basketItem);

    return {
      message: EPublicMessages.FoodAddedToBasket,
    };
  }

  async removeFromBasket(basketDto: BasketDto) {
    const { id: userId } = this.req.user!;
    const { foodId } = basketDto;

    await this.menuService.getOne(foodId);
    const basketItem = await this.userBasketRepository.findOneBy({
      userId,
      foodId,
    });

    if (!basketItem) {
      throw new NotFoundException(EBadRequestMessages.BasketNotFound);
    }

    if (basketItem.count <= 1) {
      await this.userBasketRepository.delete(basketItem);
    } else {
      basketItem.count -= 1;

      await this.userBasketRepository.save(basketItem);
    }

    return {
      message: EPublicMessages.FoodRemovedFromBakst,
    };
  }

  async addDiscount(basketDiscountDto: BasketDiscountDto) {
    const { id: userId } = this.req.user!;
    const { code } = basketDiscountDto;

    const discount = await this.discountService.findOne(code);
    if (!discount.active) {
      throw new BadRequestException(EBadRequestMessages.DiscountIsNotActive);
    }
    if (discount?.limit && discount.limit <= discount.usage) {
      throw new BadRequestException(EBadRequestMessages.OutOfDiscountCapacity);
    }
    if (
      discount?.expires_in &&
      discount.expires_in.getTime() <= new Date().getTime()
    ) {
      throw new BadRequestException(EBadRequestMessages.DiscountIsExpired);
    }

    if (discount.supplierId) {
      const basketDiscount = await this.userBasketRepository.findOne({
        relations: {
          discount: true,
        },
        where: {
          userId,
          discount: {
            supplierId: discount.supplierId,
          },
        },
      });
      if (basketDiscount) {
        throw new BadRequestException(
          EBadRequestMessages.CannotUseDiscountMultipleTimes,
        );
      }

      const basket = await this.userBasketRepository.findOne({
        relations: {
          food: true,
        },
        where: {
          userId,
          food: {
            supplier: {
              id: discount.supplierId,
            },
          },
        },
      });
      if (!basket) {
        throw new BadRequestException(
          EBadRequestMessages.CannotUseThisDiscountCode,
        );
      }
    } else if (!discount.supplierId) {
      const discount = await this.userBasketRepository.findOne({
        relations: {
          discount: true,
        },
        where: {
          userId,
          discount: {
            id: Not(IsNull()),
            supplier: IsNull(),
          },
        },
      });
      if (discount) {
        throw new BadRequestException(
          EBadRequestMessages.CannotUseGeneralDiscountMultipleTimes,
        );
      }
    }

    await this.userBasketRepository.insert({
      discountId: discount.id,
      userId,
    });

    return {
      message: EPublicMessages.DiscountAddedSuccessfully,
    };
  }

  async removeDiscount(basketDiscountDto: BasketDiscountDto) {
    const { id: userId } = this.req.user!;
    const { code } = basketDiscountDto;

    const discount = await this.discountService.findOne(code);
    const basketDiscount = await this.userBasketRepository.findOneBy({
      userId,
      discountId: discount.id,
    });
    if (!basketDiscount) {
      throw new NotFoundException(ENotFoundMessages.DiscountNotFound);
    }

    await this.userBasketRepository.delete({ userId, discountId: discount.id });

    return {
      message: EPublicMessages.DiscountDeletedSuccessfully,
    };
  }
}
