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
      await this.userBasketRepository.delete({ userId, foodId });
    } else {
      basketItem.count -= 1;

      await this.userBasketRepository.save(basketItem);
    }

    return {
      message: EPublicMessages.FoodRemovedFromBasket,
    };
  }

  async getBasket() {
    const { id: userId } = this.req.user!;
    const basketItems = await this.userBasketRepository.find({
      relations: {
        discount: true,
        food: {
          supplier: true,
        },
      },
      where: {
        userId,
      },
    });

    const foods = basketItems.filter((item) => item.foodId);
    const supplierDiscounts = basketItems.filter(
      (item) => item?.discount?.supplierId,
    );
    const generalDiscount = basketItems.find(
      (item) => item?.discount?.id && !item?.discount?.supplierId,
    );
    let totalAmount = 0;
    let paymentAmount = 0;
    let totalDiscountAmount = 0;
    let foodList: object[] = [];

    for (const item of foods) {
      let discountAmount = 0;
      let discountCode: string | null = null;

      const { food, count } = item;
      const supplierId = food.supplierId;
      let foodPrice = food.price * count;

      totalAmount += food.price * count;

      if (food.is_active_discount && food.discount > 0) {
        discountAmount += foodPrice * (food.discount / 100);
        foodPrice = foodPrice - foodPrice * (food.discount / 100);
      }
      const discountItem = supplierDiscounts.find(
        ({ discount }) => discount.supplierId === supplierId,
      );
      if (discountItem) {
        const {
          discount: { active, amount, percent, limit, usage, code },
        } = discountItem;

        if (active) {
          if (!limit || (limit && limit > usage)) {
            discountCode = code;
            if (percent && percent > 0) {
              discountAmount += foodPrice * (percent / 100);
              foodPrice = foodPrice - foodPrice * (percent / 100);
            } else if (amount && amount > 0) {
              discountAmount += amount;
              foodPrice = amount > foodPrice ? 0 : foodPrice - amount;
            }
          }
        }
      }

      paymentAmount += foodPrice;
      totalDiscountAmount += discountAmount;
      foodList.push({
        name: food.name,
        description: food.description,
        count,
        image: food.image,
        price: food.price,
        totalAmount: food.price * count,
        discountAmount,
        paymentAmount: food.price * count - discountAmount,
        discountCode,
        supplierId,
        supplierName: food.supplier.store_name,
        supplierImage: food?.supplier?.images,
      });
    }

    let generalDiscountDetail = {};
    if (generalDiscount?.discount?.active) {
      const { discount } = generalDiscount;

      if (discount?.limit && discount?.limit > discount.usage) {
        let discountAmount = 0;
        if (discount.percent > 0) {
          discountAmount = paymentAmount * (discount.percent / 100);
        } else if (discount.amount > 0) {
          discountAmount = discount.amount;
        }
        paymentAmount =
          discountAmount > paymentAmount ? 0 : paymentAmount - discountAmount;
        totalDiscountAmount += discountAmount;

        generalDiscountDetail = {
          code: discount.code,
          percent: discount.percent,
          amount: discount.amount,
          paymentAmount,
        };
      }
    }

    return {
      paymentAmount,
      totalAmount,
      totalDiscountAmount,
      foodList,
      generalDiscountDetail,
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
