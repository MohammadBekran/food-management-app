import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { UserBasketEntity } from './entities/basket.entity';
import { MenuModule } from '../menu/menu.module';
import { AuthModule } from '../auth/auth.module';
import { DiscountModule } from '../discount/discount.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserBasketEntity]),
    MenuModule,
    AuthModule,
    DiscountModule,
  ],
  controllers: [BasketController],
  providers: [BasketService],
})
export class BasketModule {}
