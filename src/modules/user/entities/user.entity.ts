import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

import { EEntityNames } from 'src/common/enums/entity-name.enum';
import { BaseEntity } from 'src/common/entities/base.entity';

import { UserAddressEntity } from './user-address.entity';

@Entity(EEntityNames.User)
export class UserEntity extends BaseEntity {
  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true, unique: true })
  phone: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ unique: true })
  invite_code: string;

  @Column({ unique: true })
  score: string;

  @Column({ unique: true })
  agentId: string;

  @CreateDateColumn({ type: 'time with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'time with time zone' })
  updated_at: Date;

  @OneToMany(() => UserAddressEntity, (userAddress) => userAddress.user)
  addresses: UserAddressEntity[];
}
