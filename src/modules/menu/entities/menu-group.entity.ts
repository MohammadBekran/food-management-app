import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { EEntityNames } from 'src/common/enums/entity-name.enum';
import { BaseEntity } from 'src/common/entities/base.entity';
import { SupplierEntity } from 'src/modules/supplier/entities/supplier.entity';

import { MenuEntity } from './menu.entity';

@Entity(EEntityNames.MenuGroup)
export class MenuGroupEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  supplierId: string;

  @ManyToOne(() => SupplierEntity, (supplier) => supplier.menuGroups)
  supplier: SupplierEntity;

  @OneToMany(() => MenuEntity, (menu) => menu.menuGroup)
  items: MenuEntity[];
}
