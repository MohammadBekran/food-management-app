import { Module } from '@nestjs/common';

import { CategoryModule } from '../category/category.module';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule, CategoryModule],
})
export class AppModule {}
