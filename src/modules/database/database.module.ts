import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmConfiguration } from 'src/configs/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfiguration())],
})
export class DatabaseModule {}
