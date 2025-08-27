import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { CategoryModule } from '../category/category.module';
import { DatabaseModule } from '../database/database.module';
import { MenuModule } from '../menu/menu.module';
import { SupplierModule } from '../supplier/supplier.module';
import { DiscountModule } from '../discount/discount.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    SupplierModule,
    CategoryModule,
    MenuModule,
    DiscountModule,
  ],
})
export class AppModule {}
