import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { EEntityNames } from 'src/common/enums/entity-name.enum';

import { SupplierEntity } from './supplier.entity';

@Entity(EEntityNames.SupplierOtp)
export class SupplierOtpEntity extends BaseEntity {
  @Column()
  code: string;

  @Column()
  expires_in: Date;

  @Column()
  supplierId: string;

  @CreateDateColumn({ type: 'time with time zone' })
  created_at: Date;

  @OneToOne(() => SupplierEntity, (supplier) => supplier.otp, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  supplier: SupplierEntity;
}
