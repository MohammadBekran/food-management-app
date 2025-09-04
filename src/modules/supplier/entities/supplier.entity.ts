import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { EEntityNames } from 'src/common/enums/entity-name.enum';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { DiscountEntity } from 'src/modules/discount/entity/discount.entity';
import { MenuGroupEntity } from 'src/modules/menu/entities/menu-group.entity';
import { MenuEntity } from 'src/modules/menu/entities/menu.entity';
import { OrderItemEntity } from 'src/modules/order/entities/order-item.entity';

import { ESupplierStatus } from '../enums/status.enum';
import { SupplierOtpEntity } from './otp.entity';
import { SupplierContractEntity } from './supplier-contract.entity';
import { SupplierDocumentEntity } from './supplier-document.entity';
import { SupplierImageEntity } from './supplier-image.entity';

@Entity(EEntityNames.Supplier)
export class SupplierEntity extends BaseEntity {
  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  national_code: string;

  @Column({ nullable: true, default: ESupplierStatus.Registered })
  status: string;

  @Column({ nullable: true, default: false })
  is_mobile_verified: boolean;

  @Column()
  city: string;

  @Column()
  store_name: string;

  @Column()
  invite_code: string;

  @Column({ nullable: true })
  otpId: string;

  @Column({ nullable: true })
  categoryId: string;

  @Column({ nullable: true })
  agentId: string;

  @CreateDateColumn({ type: 'time with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'time with time zone' })
  updated_at: Date;

  @OneToOne(() => SupplierOtpEntity, (otp) => otp.supplier)
  @JoinColumn()
  otp: SupplierOtpEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.suppliers, {
    onDelete: 'SET NULL',
  })
  category: CategoryEntity;

  @ManyToOne(() => SupplierEntity, (user) => user.subsets)
  user: SupplierEntity;

  @OneToMany(() => SupplierEntity, (user) => user.user)
  subsets: SupplierEntity[];

  @OneToMany(() => SupplierImageEntity, (image) => image.supplier)
  images: SupplierImageEntity[];

  @OneToMany(() => SupplierDocumentEntity, (document) => document.supplier)
  documents: SupplierDocumentEntity[];

  @OneToMany(() => MenuEntity, (menu) => menu.supplier)
  menus: MenuEntity;

  @OneToMany(() => MenuGroupEntity, (menuGroup) => menuGroup.supplier)
  menuGroups: MenuGroupEntity;

  @OneToMany(() => DiscountEntity, (discount) => discount.supplier)
  discounts: DiscountEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.supplier)
  orders: OrderItemEntity;

  @OneToOne(() => SupplierContractEntity, (contract) => contract.supplier)
  contract: SupplierContractEntity;
}
