import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { EEntityNames } from 'src/common/enums/entity-name.enum';

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

  @CreateDateColumn({ type: 'time with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'time with time zone' })
  updated_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.addresses)
  user: UserEntity;
}
