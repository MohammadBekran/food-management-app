import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusColumnToSupplierEntity1754133977999
  implements MigrationInterface
{
  name = 'AddStatusColumnToSupplierEntity1754133977999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "use_otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "expires_in" TIMESTAMP NOT NULL, "userId" uuid NOT NULL, "created_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_7204a98db9f216f491c2aac1cc" UNIQUE ("userId"), CONSTRAINT "PK_0c8a582f05a10703fa676ae0bde" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "supplier_otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "expires_in" TIMESTAMP NOT NULL, "supplierId" uuid NOT NULL, "created_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_65d22567046d4a713b2fe0ca86" UNIQUE ("supplierId"), CONSTRAINT "PK_9c8e2cec13e59019728da5505ff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "supplier" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "national_code" character varying NOT NULL, "status" character varying DEFAULT 'registered', "is_mobile_verified" boolean DEFAULT false, "city" character varying NOT NULL, "store_name" character varying NOT NULL, "invite_code" character varying NOT NULL, "otpId" uuid, "categoryId" uuid, "agentId" character varying, "created_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "REL_f93bbb8ccb3547ad2b6f2f1de5" UNIQUE ("otpId"), CONSTRAINT "PK_2bc0d2cab6276144d2ff98a2828" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "use_otp" ADD CONSTRAINT "FK_7204a98db9f216f491c2aac1ccd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_otp" ADD CONSTRAINT "FK_65d22567046d4a713b2fe0ca86b" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier" ADD CONSTRAINT "FK_f93bbb8ccb3547ad2b6f2f1de5c" FOREIGN KEY ("otpId") REFERENCES "supplier_otp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier" ADD CONSTRAINT "FK_13d4807875d76e6a4ae8ae16e66" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier" ADD CONSTRAINT "FK_e8902c50550ff82dd0143913c0a" FOREIGN KEY ("userId") REFERENCES "supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "supplier" DROP CONSTRAINT "FK_e8902c50550ff82dd0143913c0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier" DROP CONSTRAINT "FK_13d4807875d76e6a4ae8ae16e66"`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier" DROP CONSTRAINT "FK_f93bbb8ccb3547ad2b6f2f1de5c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_otp" DROP CONSTRAINT "FK_65d22567046d4a713b2fe0ca86b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "use_otp" DROP CONSTRAINT "FK_7204a98db9f216f491c2aac1ccd"`,
    );
    await queryRunner.query(`DROP TABLE "supplier"`);
    await queryRunner.query(`DROP TABLE "supplier_otp"`);
    await queryRunner.query(`DROP TABLE "use_otp"`);
  }
}
