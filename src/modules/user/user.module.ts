import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { OrderModule } from '../order/order.module';
import { UserAddressController } from './controllers/user-address.controller';
import { UserController } from './controllers/user.controller';
import { UserAddressEntity } from './entities/user-address.entity';
import { UserAddressService } from './services/user-address.service';
import { UserService } from './services/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAddressEntity]),
    AuthModule,
    forwardRef(() => OrderModule),
  ],
  controllers: [UserController, UserAddressController],
  providers: [UserService, UserAddressService],
  exports: [TypeOrmModule, UserService, UserAddressService],
})
export class UserModule {}
