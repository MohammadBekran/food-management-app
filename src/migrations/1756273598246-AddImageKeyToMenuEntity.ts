import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageKeyToMenuEntity1756273598246
  implements MigrationInterface
{
  name = 'AddImageKeyToMenuEntity1756273598246';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "menu" ADD "imageKey" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "menu" DROP COLUMN "imageKey"`);
  }
}
