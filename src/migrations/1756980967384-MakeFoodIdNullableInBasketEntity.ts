import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeFoodIdNullableInBasketEntity1756980967384
  implements MigrationInterface
{
  name = 'MakeFoodIdNullableInBasketEntity1756980967384';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_basket" DROP CONSTRAINT "FK_c5a7836a95273088a74fbc88c96"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_basket" ALTER COLUMN "foodId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_basket" ADD CONSTRAINT "FK_c5a7836a95273088a74fbc88c96" FOREIGN KEY ("foodId") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_basket" DROP CONSTRAINT "FK_c5a7836a95273088a74fbc88c96"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_basket" ALTER COLUMN "foodId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_basket" ADD CONSTRAINT "FK_c5a7836a95273088a74fbc88c96" FOREIGN KEY ("foodId") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
