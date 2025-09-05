import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserAddressController } from './controllers/user-address.controller';
import { UserAddressEntity } from './entities/user-address.entity';
import { UserAddressService } from './services/user-address.service';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddressEntity]), AuthModule],
  controllers: [UserController, UserAddressController],
  providers: [UserService, UserAddressService],
  exports: [TypeOrmModule, UserService, UserAddressService],
})
export class UserModule {}
