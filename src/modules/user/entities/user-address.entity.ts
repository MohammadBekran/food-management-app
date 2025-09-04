import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { EEntityNames } from 'src/common/enums/entity-name.enum';
import { OrderEntity } from 'src/modules/order/entities/order.entity';

import { UserEntity } from './user.entity';

@Entity(EEntityNames.UserAddress)
export class UserAddressEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  province: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  postal_code: string;

  @Column()
  userId: string;

  @OneToMany(() => OrderEntity, (order) => order.address, {
    onDelete: 'CASCADE',
  })
  orders: OrderEntity;

  @ManyToOne(() => UserEntity, (user) => user.addresses, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @CreateDateColumn({ type: 'time with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'time with time zone' })
  updated_at: Date;
}
