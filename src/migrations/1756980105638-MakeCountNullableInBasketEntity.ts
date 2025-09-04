import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeCountNullableInBasketEntity1756980105638
  implements MigrationInterface
{
  name = 'MakeCountNullableInBasketEntity1756980105638';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_basket" ALTER COLUMN "count" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_basket" ALTER COLUMN "count" SET NOT NULL`,
    );
  }
}
