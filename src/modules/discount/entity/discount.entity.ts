import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { EEntityNames } from 'src/common/enums/entity-name.enum';
import { SupplierEntity } from 'src/modules/supplier/entities/supplier.entity';
import { UserBasketEntity } from 'src/modules/basket/entities/basket.entity';

@Entity(EEntityNames.Discount)
export class DiscountEntity extends BaseEntity {
  @Column()
  code: string;

  @Column({ type: 'numeric', nullable: true })
  percent: number;

  @Column({ type: 'numeric', nullable: true })
  amount: number;

  @Column({ nullable: true })
  limit: number;

  @Column({ nullable: true, default: 0 })
  usage: number;

  @Column({ nullable: true })
  expires_in: Date;

  @Column({ nullable: true })
  supplierId: string;

  @ManyToOne(() => SupplierEntity, (supplier) => supplier.discounts)
  supplier: SupplierEntity;

  @OneToMany(() => UserBasketEntity, (basket) => basket.discount)
  baskets: UserBasketEntity;
}
