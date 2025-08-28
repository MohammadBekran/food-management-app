import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Repository } from 'typeorm';
import type { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';

import { BasketDto } from './dto/basket.dto';
import { MenuService } from '../menu/services/menu.service';
import { UserBasketEntity } from './entities/basket.entity';
import {
  ENotBadRequestMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';

@Injectable()
export class BasketService {
  constructor(
    @Inject(REQUEST) private req: Request,
    private menuService: MenuService,

    @InjectRepository(UserBasketEntity)
    private userBasketRepository: Repository<UserBasketEntity>,
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
      throw new NotFoundException(ENotBadRequestMessages.BasketNotFound);
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
}
