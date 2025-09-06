import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity]),
    forwardRef(() => UserModule),
  ],
  providers: [OrderService],
  exports: [TypeOrmModule, OrderService],
})
export class OrderModule {}
