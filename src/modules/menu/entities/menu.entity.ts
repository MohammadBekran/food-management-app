import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { SupplierEntity } from 'src/modules/supplier/entities/supplier.entity';
import { EEntityNames } from 'src/common/enums/entity-name.enum';
import { BaseEntity } from 'src/common/entities/base.entity';

import { MenuGroupEntity } from './menu-group.entity';
import { MenuFeedbackEntity } from './menu-feedback.entity';

@Entity(EEntityNames.Menu)
export class MenuEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  image: string;

  @Column({ type: 'numeric' })
  price: string;

  @Column({ type: 'numeric' })
  discount: number;

  @Column()
  description: string;

  @Column({ type: 'numeric' })
  score: number;

  @Column()
  supplierId: string;

  @Column()
  menuGroupId: string;

  @ManyToOne(() => SupplierEntity, (supplier) => supplier.menus, {
    onDelete: 'CASCADE',
  })
  supplier: SupplierEntity;

  @ManyToOne(() => MenuGroupEntity, (menuGroup) => menuGroup.items, {
    onDelete: 'CASCADE',
  })
  menuGroup: MenuGroupEntity;

  @OneToMany(() => MenuFeedbackEntity, (menuFeedback) => menuFeedback.menu)
  feedbacks: MenuFeedbackEntity[];
}
