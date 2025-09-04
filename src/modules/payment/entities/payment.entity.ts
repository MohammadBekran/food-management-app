import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { EEntityNames } from 'src/common/enums/entity-name.enum';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Entity(EEntityNames.Payment)
export class PaymentEntity extends BaseEntity {
  @Column({ default: false })
  status: boolean;

  @Column()
  amount: number;

  @Column()
  userId: string;

  @Column()
  orderId: string;

  @ManyToOne(() => OrderEntity, (order) => order.payments, {
    onDelete: 'CASCADE',
  })
  order: OrderEntity;

  @ManyToOne(() => UserEntity, (user) => user.payments, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @CreateDateColumn({ type: 'time with time zone' })
  created_at: Date;
}
