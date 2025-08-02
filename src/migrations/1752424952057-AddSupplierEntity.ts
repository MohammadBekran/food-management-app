import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSupplierEntity1752424952057 implements MigrationInterface {
    name = 'AddSupplierEntity1752424952057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "supplier" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "phone" character varying NOT NULL, "is_mobile_verified" boolean DEFAULT false, "city" character varying NOT NULL, "store_name" character varying NOT NULL, "invite_code" character varying NOT NULL, "categoryId" uuid, "agentId" character varying, "created_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_2bc0d2cab6276144d2ff98a2828" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "supplier" ADD CONSTRAINT "FK_13d4807875d76e6a4ae8ae16e66" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supplier" ADD CONSTRAINT "FK_e8902c50550ff82dd0143913c0a" FOREIGN KEY ("userId") REFERENCES "supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "supplier" DROP CONSTRAINT "FK_e8902c50550ff82dd0143913c0a"`);
        await queryRunner.query(`ALTER TABLE "supplier" DROP CONSTRAINT "FK_13d4807875d76e6a4ae8ae16e66"`);
        await queryRunner.query(`DROP TABLE "supplier"`);
    }

}
