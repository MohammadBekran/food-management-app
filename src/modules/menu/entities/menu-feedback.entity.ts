import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { EEntityNames } from 'src/common/enums/entity-name.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';

import { MenuEntity } from './menu.entity';

@Entity(EEntityNames.MenuFeedback)
export class MenuFeedbackEntity extends BaseEntity {
  @Column()
  userId: string;

  @Column()
  menuId: string;

  @Column()
  comment: string;

  @Column()
  score: string;

  @ManyToOne(() => UserEntity, (user) => user.feedbacks, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => MenuEntity, (menu) => menu.feedbacks, {
    onDelete: 'CASCADE',
  })
  menu: MenuEntity;

  @CreateDateColumn()
  createdAt: Date;
}
