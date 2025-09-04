import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { EEntityNames } from 'src/common/enums/entity-name.enum';
import { UserBasketEntity } from 'src/modules/basket/entities/basket.entity';
import { MenuFeedbackEntity } from 'src/modules/menu/entities/menu-feedback.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { PaymentEntity } from 'src/modules/payment/payment.entity';

import { OtpEntity } from './otp.entity';
import { UserAddressEntity } from './user-address.entity';

@Entity(EEntityNames.User)
export class UserEntity extends BaseEntity {
  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true, unique: true })
  phone: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true, unique: true })
  invite_code: string;

  @Column({ nullable: true, unique: true })
  score: string;

  @Column({ nullable: true, unique: true })
  otpId: string;

  @Column({ nullable: true, unique: true })
  agentId: string;

  @Column({ nullable: true, default: false })
  is_mobile_verified: boolean;

  @OneToOne(() => OtpEntity, (otp) => otp.user)
  otp: OtpEntity;

  @OneToMany(() => UserAddressEntity, (userAddress) => userAddress.user)
  addresses: UserAddressEntity[];

  @OneToMany(() => MenuFeedbackEntity, (menuFeedback) => menuFeedback.user)
  feedbacks: MenuFeedbackEntity[];

  @OneToMany(() => UserBasketEntity, (userBasket) => userBasket.user)
  baskets: UserBasketEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.user)
  payments: PaymentEntity[];

  @CreateDateColumn({ type: 'time with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'time with time zone' })
  updated_at: Date;
}
