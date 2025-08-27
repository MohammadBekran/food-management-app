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

import { OtpEntity } from './otp.entity';
import { UserAddressEntity } from './user-address.entity';
import { MenuFeedbackEntity } from 'src/modules/menu/entities/menu-feedback.entity';

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

  @CreateDateColumn({ type: 'time with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'time with time zone' })
  updated_at: Date;
}
