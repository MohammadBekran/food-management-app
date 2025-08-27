import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MenuGroupController } from './controllers/menu-group.controller';
import { MenuFeedbackEntity } from './entities/menu-feedback.entity';
import { MenuGroupEntity } from './entities/menu-group.entity';
import { MenuEntity } from './entities/menu.entity';
import { MenuGroupService } from './services/menu-group.service';
import { SupplierModule } from '../supplier/supplier.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MenuEntity, MenuGroupEntity, MenuFeedbackEntity]),
    SupplierModule,
  ],
  controllers: [MenuGroupController],
  providers: [MenuGroupService],
})
export class MenuModule {}
