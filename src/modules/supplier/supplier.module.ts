import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { SupplierEntity } from './entities/supplier.entity';
import { SupplierOtpEntity } from './entities/otp.entity';
import { CategoryModule } from '../category/category.module';
import { SupplierImageEntity } from './entities/supplier-image.entity';
import { SupplierDocumentEntity } from './entities/supplier-document.entity';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupplierEntity,
      SupplierOtpEntity,
      SupplierImageEntity,
      SupplierDocumentEntity,
    ]),
    CategoryModule,
    JwtModule,
    S3Module,
  ],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
