import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { S3Module } from '../s3/s3.module';
import { SupplierModule } from '../supplier/supplier.module';
import { MenuGroupController } from './controllers/menu-group.controller';
import { MenuController } from './controllers/menu.controller';
import { MenuFeedbackEntity } from './entities/menu-feedback.entity';
import { MenuGroupEntity } from './entities/menu-group.entity';
import { MenuEntity } from './entities/menu.entity';
import { MenuGroupService } from './services/menu-group.service';
import { MenuService } from './services/menu.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MenuEntity, MenuGroupEntity, MenuFeedbackEntity]),
    SupplierModule,
    S3Module,
  ],
  controllers: [MenuController, MenuGroupController],
  providers: [MenuService, MenuGroupService],
  exports: [TypeOrmModule, MenuService, MenuGroupService],
})
export class MenuModule {}
