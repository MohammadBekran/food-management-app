import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { EEntityNames } from 'src/common/enums/entity-name.enum';

import { SupplierEntity } from './supplier.entity';

@Entity(EEntityNames.SupplierDocument)
export class SupplierDocumentEntity extends BaseEntity {
  @Column()
  document: string;

  @Column()
  supplierId: string;

  @ManyToOne(() => SupplierEntity, (supplier) => supplier.documents)
  supplier: SupplierEntity;
}
