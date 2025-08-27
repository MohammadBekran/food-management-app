import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMenuRelatedEntities1756270087673 implements MigrationInterface {
  name = 'AddMenuRelatedEntities1756270087673';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "menu" DROP CONSTRAINT "FK_3da7355596b85b785fef89cd3e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu" RENAME COLUMN "menuTypeId" TO "menuGroupId"`,
    );
    await queryRunner.query(
      `CREATE TABLE "menu_group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "supplierId" uuid NOT NULL, CONSTRAINT "PK_1b4355838e113a92087ecb039ee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu_group" ADD CONSTRAINT "FK_3b0f34dae46c2ed28f6c7100383" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu" ADD CONSTRAINT "FK_c68620d2c627287350bda5f1f15" FOREIGN KEY ("menuGroupId") REFERENCES "menu_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "menu" DROP CONSTRAINT "FK_c68620d2c627287350bda5f1f15"`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu_group" DROP CONSTRAINT "FK_3b0f34dae46c2ed28f6c7100383"`,
    );
    await queryRunner.query(`DROP TABLE "menu_group"`);
    await queryRunner.query(
      `ALTER TABLE "menu" RENAME COLUMN "menuGroupId" TO "menuTypeId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu" ADD CONSTRAINT "FK_3da7355596b85b785fef89cd3e5" FOREIGN KEY ("menuTypeId") REFERENCES "menu_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
