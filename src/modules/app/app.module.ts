import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { BasketModule } from '../basket/basket.module';
import { CategoryModule } from '../category/category.module';
import { DatabaseModule } from '../database/database.module';
import { DiscountModule } from '../discount/discount.module';
import { MenuModule } from '../menu/menu.module';
import { SupplierModule } from '../supplier/supplier.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    SupplierModule,
    CategoryModule,
    MenuModule,
    DiscountModule,
    BasketModule,
  ],
})
export class AppModule {}
