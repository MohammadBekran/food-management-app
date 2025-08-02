import { Module } from '@nestjs/common';

import { CategoryModule } from '../category/category.module';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { SupplierModule } from '../supplier/supplier.module';

@Module({
  imports: [DatabaseModule, AuthModule, SupplierModule, CategoryModule],
})
export class AppModule {}
