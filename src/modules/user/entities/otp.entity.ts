import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { EEntityNames } from 'src/common/enums/entity-name.enum';

import { UserEntity } from './user.entity';

@Entity(EEntityNames.Otp)
export class OtpEntity extends BaseEntity {
  @Column()
  code: string;

  @Column()
  expires_in: Date;

  @Column()
  userId: string;

  @CreateDateColumn({ type: 'time with time zone' })
  created_at: Date;

  @OneToOne(() => UserEntity, (user) => user.otp, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;
}
