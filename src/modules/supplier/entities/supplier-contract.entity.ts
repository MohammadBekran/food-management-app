import { Column, Entity, OneToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { EEntityNames } from 'src/common/enums/entity-name.enum';

import { SupplierEntity } from './supplier.entity';

@Entity(EEntityNames.SupplierContract)
export class SupplierContractEntity extends BaseEntity {
  @Column()
  contract: string;

  @Column()
  supplierId: string;

  @OneToOne(() => SupplierEntity, (supplier) => supplier.contract)
  supplier: SupplierEntity;
}
