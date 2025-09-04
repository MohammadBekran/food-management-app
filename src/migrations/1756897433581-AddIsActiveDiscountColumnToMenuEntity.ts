import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsActiveDiscountColumnToMenuEntity1756897433581
  implements MigrationInterface
{
  name = 'AddIsActiveDiscountColumnToMenuEntity1756897433581';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "menu" ADD "is_active_discount" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "menu" DROP COLUMN "is_active_discount"`,
    );
  }
}
