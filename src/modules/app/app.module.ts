import { Module } from '@nestjs/common';

import { CategoryModule } from '../category/category.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, CategoryModule],
})
export class AppModule {}
