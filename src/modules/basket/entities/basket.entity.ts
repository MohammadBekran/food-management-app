import { Column, Entity, ManyToOne } from 'typeorm';

import { EEntityNames } from 'src/common/enums/entity-name.enum';
import { BaseEntity } from 'src/common/entities/base.entity';
import { MenuEntity } from 'src/modules/menu/entities/menu.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { DiscountEntity } from 'src/modules/discount/entity/discount.entity';

import { EBasketDiscountType } from '../enums/discount-type.enum';

@Entity(EEntityNames.UserBasket)
export class UserBasketEntity extends BaseEntity {
  @Column({ nullable: true })
  count: number;

  @Column({ type: 'enum', enum: EBasketDiscountType, nullable: true })
  type: string;

  @Column({ nullable: true })
  discountId: string;

  @Column({ nullable: true })
  foodId: string;

  @Column()
  userId: string;

  @ManyToOne(() => DiscountEntity, (discount) => discount.baskets, {
    onDelete: 'CASCADE',
  })
  discount: DiscountEntity;

  @ManyToOne(() => MenuEntity, (food) => food.baskets, { onDelete: 'CASCADE' })
  food: MenuEntity;

  @ManyToOne(() => UserEntity, (user) => user.baskets, { onDelete: 'CASCADE' })
  user: UserEntity;
}
