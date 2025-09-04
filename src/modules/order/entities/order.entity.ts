import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { EEntityNames } from 'src/common/enums/entity-name.enum';
import { PaymentEntity } from 'src/modules/payment/payment.entity';
import { UserAddressEntity } from 'src/modules/user/entities/user-address.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

import { EOrderStatus } from '../enums/status.enum';
import { OrderItemEntity } from './order-item.entity';

@Entity(EEntityNames.Order)
export class OrderEntity extends BaseEntity {
  @Column()
  userId: string;

  @Column()
  addressId: string;

  @Column()
  total_amount: number;

  @Column()
  payment_amount: number;

  @Column()
  discount_amount: number;

  @Column({ type: 'enum', enum: EOrderStatus, default: EOrderStatus.Pending })
  status: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => UserAddressEntity, (address) => address.orders, {
    onDelete: 'SET NULL',
  })
  address: UserAddressEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order, {
    onDelete: 'SET NULL',
  })
  items: OrderItemEntity;

  @OneToMany(() => PaymentEntity, (payment) => payment.order, {
    onDelete: 'SET NULL',
  })
  payments: PaymentEntity;
}
