import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { EEntityNames } from 'src/common/enums/entity-name.enum';

import { SupplierEntity } from './supplier.entity';

@Entity(EEntityNames.SupplierImage)
export class SupplierImageEntity extends BaseEntity {
  @Column()
  image: string;

  @Column()
  supplierId: string;

  @ManyToOne(() => SupplierEntity, (supplier) => supplier.images)
  supplier: SupplierEntity;
}
