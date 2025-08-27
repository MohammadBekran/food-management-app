import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { UserBasketEntity } from './entities/basket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserBasketEntity])],
  controllers: [BasketController],
  providers: [BasketService],
})
export class BasketModule {}
