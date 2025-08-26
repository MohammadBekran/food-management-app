import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryModule } from '../category/category.module';
import { S3Module } from '../s3/s3.module';
import { SupplierOtpEntity } from './entities/otp.entity';
import { SupplierContractEntity } from './entities/supplier-contract.entity';
import { SupplierDocumentEntity } from './entities/supplier-document.entity';
import { SupplierImageEntity } from './entities/supplier-image.entity';
import { SupplierEntity } from './entities/supplier.entity';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupplierEntity,
      SupplierOtpEntity,
      SupplierImageEntity,
      SupplierDocumentEntity,
      SupplierContractEntity,
    ]),
    CategoryModule,
    JwtModule,
    S3Module,
  ],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
