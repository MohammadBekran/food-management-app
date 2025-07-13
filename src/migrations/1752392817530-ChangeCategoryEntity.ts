import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeCategoryEntity1752392817530 implements MigrationInterface {
    name = 'ChangeCategoryEntity1752392817530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "show" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "category" ADD "imageKey" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "category" ADD "imageUrl" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "imageUrl"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "imageKey"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "show"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "image" character varying NOT NULL`);
    }

}
