import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import type { Request } from 'express';
import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  Like,
  Repository,
} from 'typeorm';

import {
  EBadRequestMessages,
  ENotFoundMessages,
} from 'src/common/enums/message.enum';

import type { IGetBasketResponse } from '../basket/interfaces/get-basket-response.interface';
import { PaymentDto } from '../payment/dto/payment.dto';
import { UserAddressService } from '../user/services/user-address.service';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderEntity } from './entities/order.entity';
import { EOrderItemStatus } from './enums/status.enum';
import { GetUserOrdersDto } from '../user/dto/user.dto';

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
  constructor(
    @Inject(REQUEST) private req: Request,
    private dataSource: DataSource,

    private userAddressService: UserAddressService,

    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  async create(basket: IGetBasketResponse, paymentDto: PaymentDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const { id: userId } = this.req.user!;
      const { totalAmount, paymentAmount, foodList, totalDiscountAmount } =
        basket;
      const { addressId, description } = paymentDto;

      const address = await this.userAddressService.findOne(addressId);

      let order = queryRunner.manager.create(OrderEntity, {
        userId,
        addressId: address.id,
        description,
        total_amount: totalAmount,
        payment_amount: paymentAmount,
        discount_amount: totalDiscountAmount,
      });

      order = await queryRunner.manager.save(OrderEntity, order);

      let orderItems: DeepPartial<OrderItemEntity>[] = [];

      for (const { count, foodId, supplierId } of foodList) {
        orderItems.push({
          foodId,
          supplierId,
          orderId: order.id,
          count,
          status: EOrderItemStatus.Pending,
        });
      }

      if (orderItems.length > 0) {
        await queryRunner.manager.insert(OrderItemEntity, orderItems);
      } else {
        throw new BadRequestException(EBadRequestMessages.FoodListIsEmpty);
      }

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      throw error;
    }
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException(ENotFoundMessages.OrderNotFound);
    }

    return order;
  }

  async save(order: OrderEntity) {
    await this.orderRepository.save(order);
  }

  async findUserOrders(getUserOrdersDto: GetUserOrdersDto) {
    const { id: userId } = this.req.user!;
    const { status, search } = getUserOrdersDto;

    const orderQueries: FindOptionsWhere<OrderEntity> = { userId };

    if (status) orderQueries.status = status;
    if (search) orderQueries.description = Like(`%${search}%`);

    const orders = await this.orderRepository.find({
      where: orderQueries,
      relations: { items: true, address: true, payments: true },
    });

    return orders;
  }
}
