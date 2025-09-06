import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { BasketModule } from '../basket/basket.module';
import { CategoryModule } from '../category/category.module';
import { DatabaseModule } from '../database/database.module';
import { DiscountModule } from '../discount/discount.module';
import { HttpApiModule } from '../http/http.module';
import { MenuModule } from '../menu/menu.module';
import { OrderModule } from '../order/order.module';
import { PaymentModule } from '../payment/payment.module';
import { SupplierModule } from '../supplier/supplier.module';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
    DatabaseModule,
    HttpApiModule,
    AuthModule,
    UserModule,
    SupplierModule,
    CategoryModule,
    MenuModule,
    DiscountModule,
    BasketModule,
    PaymentModule,
    OrderModule,
  ],
})
export class AppModule {}
