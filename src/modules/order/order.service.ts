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
  EPublicMessages,
} from 'src/common/enums/message.enum';

import type { IGetBasketResponse } from '../basket/interfaces/get-basket-response.interface';
import { PaymentDto } from '../payment/dto/payment.dto';
import { GetSupplierOrdersDto } from '../supplier/dto/supplier.dto';
import { GetUserOrdersDto } from '../user/dto/user.dto';
import { UserAddressService } from '../user/services/user-address.service';
import { CancelOrderDto } from './dto/order.dto';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderEntity } from './entities/order.entity';
import { EOrderItemStatus, EOrderStatus } from './enums/status.enum';
import {
  paginationData,
  paginationGenerator,
} from 'src/common/utils/pagination.util';

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
    const { id: userId } = this.req.user!;
    const order = await this.orderRepository.findOneBy({ userId, id });
    if (!order) {
      throw new NotFoundException(ENotFoundMessages.OrderNotFound);
    }

    return order;
  }

  async getOne(id: string) {
    const { id: userId } = this.req.user!;

    const order = await this.orderRepository.findOne({
      where: { userId, id },
      relations: {
        items: {
          food: true,
        },
        address: true,
        payments: true,
      },
    });
    if (!order) {
      throw new NotFoundException(ENotFoundMessages.OrderNotFound);
    }

    return order;
  }

  async save(order: OrderEntity) {
    await this.orderRepository.save(order);
  }

  async cancelOrder(id: string, cancelOrderDto: CancelOrderDto) {
    const { reason } = cancelOrderDto;

    const order = await this.getUserOrder(id);
    if (order.status === EOrderStatus.Placed) {
      throw new BadRequestException(EBadRequestMessages.OrderCannotBeCanceled);
    }

    order.status = EOrderStatus.Canceled;
    if (reason) {
      order.description = reason;
    }

    await this.orderRepository.save(order);

    return {
      message: EPublicMessages.OrderCanceled,
    };
  }

  async findUserOrders(getUserOrdersDto: GetUserOrdersDto) {
    const { id: userId } = this.req.user!;
    const { status, search } = getUserOrdersDto;

    const { page, limit, skip } = paginationData(
      getUserOrdersDto.page,
      getUserOrdersDto.limit,
    );

    const orderQueries: FindOptionsWhere<OrderEntity> = { userId };

    if (status) orderQueries.status = status;
    if (search) orderQueries.description = Like(`%${search}%`);

    const [orders, count] = await this.orderRepository.findAndCount({
      where: orderQueries,
      relations: { items: true, address: true, payments: true },
      skip,
      take: limit,
    });

    return {
      orders,
      pagination: paginationGenerator(count, page, limit),
    };
  }

  async getUserOrder(id: string) {
    const { id: userId } = this.req.user!;

    const order = await this.orderRepository.findOne({
      where: { userId, id },
      relations: { items: true, address: true, payments: true },
    });
    if (!order) {
      throw new NotFoundException(ENotFoundMessages.OrderNotFound);
    }

    return order;
  }

  async getSupplierOrders(getSupplierOrdersDto: GetSupplierOrdersDto) {
    const { id: supplierId } = this.req.user!;
    const { status, search } = getSupplierOrdersDto;

    const { page, limit, skip } = paginationData(
      getSupplierOrdersDto.page,
      getSupplierOrdersDto.limit,
    );

    const orderQueries: FindOptionsWhere<OrderEntity> = {
      items: { supplierId },
    };

    if (status) orderQueries.status = status;
    if (search) orderQueries.user = Like(`%${search}%`);

    const [orders, count] = await this.orderRepository.findAndCount({
      where: orderQueries,
      relations: {
        items: { food: true, supplier: true, order: true },
        address: true,
        payments: true,
        user: true,
      },
      skip,
      take: limit,
    });

    return {
      orders,
      pagination: paginationGenerator(count, page, limit),
    };
  }

  async getSupplierOrder(id: string) {
    const { id: supplierId } = this.req.user!;

    const order = await this.orderRepository.findOne({
      where: { items: { supplierId }, id },
      relations: {
        items: { food: true, supplier: true, order: true },
        address: true,
        payments: true,
        user: true,
      },
    });
    if (!order) {
      throw new NotFoundException(ENotFoundMessages.OrderNotFound);
    }

    return order;
  }
}
