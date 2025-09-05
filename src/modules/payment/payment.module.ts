import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { BasketModule } from '../basket/basket.module';
import { OrderModule } from '../order/order.module';
import { PaymentEntity } from './entities/payment.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity]),
    AuthModule,
    BasketModule,
    OrderModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
