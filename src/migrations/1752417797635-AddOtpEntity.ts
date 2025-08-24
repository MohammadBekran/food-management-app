import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOtpEntity1752417797635 implements MigrationInterface {
  name = 'AddOtpEntity1752417797635';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "otpId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "otp" ADD "otpId" character varying NOT NULL`,
    );
  }
}
