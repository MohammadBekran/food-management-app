import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserAddressController } from './controllers/user-address.controller';
import { UserAddressEntity } from './entities/user-address.entity';
import { UserAddressService } from './services/user-address.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddressEntity]), AuthModule],
  controllers: [UserAddressController],
  providers: [UserAddressService],
  exports: [TypeOrmModule, UserAddressService],
})
export class UserModule {}
