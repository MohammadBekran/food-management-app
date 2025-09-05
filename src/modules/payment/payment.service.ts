import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import type { Request } from 'express';
import { Repository } from 'typeorm';

import {
  EConflictMessages,
  ENotFoundMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';

import { BasketService } from '../basket/basket.service';
import { ZarinpalService } from '../http/zarinpal.service';
import { EOrderStatus } from '../order/enums/status.enum';
import { OrderService } from '../order/order.service';
import { InitiatePaymentDto, PaymentDto } from './dto/payment.dto';
import { PaymentEntity } from './entities/payment.entity';
import { EPaymentStatus } from './enums/status.enum';

@Injectable({ scope: Scope.REQUEST })
export class PaymentService {
  constructor(
    @Inject(REQUEST) private req: Request,
    private basketService: BasketService,

    private zarinpalService: ZarinpalService,
    private orderService: OrderService,

    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
  ) {}

  async getGatewayUrl(paymentDto: PaymentDto) {
    const { id: userId, email, phone } = this.req.user!;

    const basket = await this.basketService.getBasket();
    const order = await this.orderService.create(basket, paymentDto);

    const payment = await this.initiatePayment({
      userId,
      orderId: order.id,
      amount: basket.paymentAmount,
      status: basket.paymentAmount === 0,
    });

    if (!payment.status) {
      const paymentResult = await this.zarinpalService.sendPaymentRequest({
        amount: basket.paymentAmount,
        description: paymentDto.description ?? 'PAYMENT',
        user: {
          email,
          phone,
        },
      });
      if (paymentResult) {
        const { authority, gatewayURL, code } = paymentResult;

        payment.authority = authority;
        await this.paymentRepository.save(payment);

        return {
          gatewayURL,
          code,
        };
      }
    } else {
      return {
        message: EPublicMessages.PaymentDoneSuccessfully,
      };
    }
  }

  async initiatePayment(initiatePaymentDto: InitiatePaymentDto) {
    const { userId, orderId, amount, status } = initiatePaymentDto;

    const payment = this.paymentRepository.create({
      orderId,
      amount,
      status,
      userId,
    });

    return await this.paymentRepository.save(payment);
  }

  async verifyPayment(authority: string, status: string) {
    const payment = await this.checkExistenceByAuthority(authority);
    if (payment.status) {
      throw new ConflictException(EConflictMessages.PaymentAlreadyVerified);
    }

    if (status === EPaymentStatus.OK) {
      payment.status = true;
      await this.paymentRepository.save(payment);

      const order = await this.orderService.findOne(payment.orderId);
      order.status = EOrderStatus.Paid;
      await this.orderService.save(order);

      return `${process.env.FRONTEND_URL}/payment?status=success`;
    } else {
      return `${process.env.FRONTEND_URL}/payment?status=failure`;
    }
  }

  async checkExistenceByAuthority(authority: string) {
    const payment = await this.paymentRepository.findOneBy({ authority });
    if (!payment) {
      throw new NotFoundException(ENotFoundMessages.PaymentNotFound);
    }

    return payment;
  }
}
