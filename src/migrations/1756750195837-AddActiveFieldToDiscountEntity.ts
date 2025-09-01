import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddActiveFieldToDiscountEntity1756750195837
  implements MigrationInterface
{
  name = 'AddActiveFieldToDiscountEntity1756750195837';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "discount" ADD "active" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "discount" DROP COLUMN "active"`);
  }
}
