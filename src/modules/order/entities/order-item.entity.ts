import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { EEntityNames } from 'src/common/enums/entity-name.enum';
import { MenuEntity } from 'src/modules/menu/entities/menu.entity';
import { SupplierEntity } from 'src/modules/supplier/entities/supplier.entity';

import { EOrderItemStatus } from '../enums/status.enum';
import { OrderEntity } from './order.entity';

@Entity(EEntityNames.OrderItem)
export class OrderItemEntity extends BaseEntity {
  @Column()
  foodId: string;

  @Column()
  orderId: string;

  @Column()
  count: number;

  @Column()
  supplierId: string;

  @Column({
    type: 'enum',
    enum: EOrderItemStatus,
    default: EOrderItemStatus.Pending,
  })
  status: string;

  @ManyToOne(() => MenuEntity, (menu) => menu.orders, {
    onDelete: 'CASCADE',
  })
  food: MenuEntity;

  @ManyToOne(() => OrderEntity, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  order: OrderEntity;

  @ManyToOne(() => SupplierEntity, (supplier) => supplier.orders, {
    onDelete: 'CASCADE',
  })
  supplier: SupplierEntity;
}
