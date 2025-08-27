import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDiscountAndBasketEntities1756319764398
  implements MigrationInterface
{
  name = 'AddDiscountAndBasketEntities1756319764398';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "discount" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "percent" numeric, "amount" numeric, "limit" integer, "usage" integer DEFAULT '0', "expires_in" TIMESTAMP, "supplierId" uuid, CONSTRAINT "PK_d05d8712e429673e459e7f1cddb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_basket_type_enum" AS ENUM('item', 'total')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_basket" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "count" integer NOT NULL, "type" "public"."user_basket_type_enum", "discountId" uuid, "foodId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_0eb611849dae2cc24307dbad184" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" ADD CONSTRAINT "FK_211ef23a0cde0aa79bbc3264ba6" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_basket" ADD CONSTRAINT "FK_f899bc096bc67cc8eb094450caa" FOREIGN KEY ("discountId") REFERENCES "discount"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_basket" ADD CONSTRAINT "FK_c5a7836a95273088a74fbc88c96" FOREIGN KEY ("foodId") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_basket" ADD CONSTRAINT "FK_0ce0acfb2aa66c31c984769a764" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_basket" DROP CONSTRAINT "FK_0ce0acfb2aa66c31c984769a764"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_basket" DROP CONSTRAINT "FK_c5a7836a95273088a74fbc88c96"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_basket" DROP CONSTRAINT "FK_f899bc096bc67cc8eb094450caa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" DROP CONSTRAINT "FK_211ef23a0cde0aa79bbc3264ba6"`,
    );
    await queryRunner.query(`DROP TABLE "user_basket"`);
    await queryRunner.query(`DROP TYPE "public"."user_basket_type_enum"`);
    await queryRunner.query(`DROP TABLE "discount"`);
  }
}
