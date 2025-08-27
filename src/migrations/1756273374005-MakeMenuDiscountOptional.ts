import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeMenuDiscountOptional1756273374005 implements MigrationInterface {
    name = 'MakeMenuDiscountOptional1756273374005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu" ALTER COLUMN "discount" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu" ALTER COLUMN "discount" DROP DEFAULT`);
    }

}
