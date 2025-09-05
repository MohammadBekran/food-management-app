import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserAddressEntity } from './entities/user-address.entity';
import { UserAddressService } from './services/user-address.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddressEntity])],
  providers: [UserAddressService],
  exports: [TypeOrmModule, UserAddressService],
})
export class UserModule {}
