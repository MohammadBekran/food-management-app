import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuthorityFieldToPaymentEntity1757046273312
  implements MigrationInterface
{
  name = 'AddAuthorityFieldToPaymentEntity1757046273312';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment" ADD "authority" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "authority"`);
  }
}
