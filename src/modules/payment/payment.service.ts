import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EPublicMessages } from 'src/common/enums/message.enum';

import { InitiatePaymentDto, PaymentDto } from './dto/payment.dto';
import { BasketService } from '../basket/basket.service';
import { PaymentEntity } from './entities/payment.entity';
import { ZarinpalService } from '../http/zarinpal.service';
import { OrderService } from '../order/order.service';

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
}
