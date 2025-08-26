import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1756193667236 implements MigrationInterface {
  name = 'InitialMigration1756193667236';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "expires_in" TIMESTAMP NOT NULL, "userId" uuid NOT NULL, "created_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_bd81461d078fe46743dd535fb2" UNIQUE ("userId"), CONSTRAINT "PK_494c022ed33e6ee19a2bbb11b22" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "province" character varying NOT NULL, "city" character varying NOT NULL, "address" character varying NOT NULL, "postal_code" character varying, "userId" uuid NOT NULL, "created_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_302d96673413455481d5ff4022a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying, "last_name" character varying, "phone" character varying, "email" character varying, "invite_code" character varying, "score" character varying, "otpId" character varying, "agentId" character varying, "is_mobile_verified" boolean DEFAULT false, "created_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_afbd6aa2cb8da01c11e1f9519f9" UNIQUE ("invite_code"), CONSTRAINT "UQ_8716c1d8a86931ab865b479d564" UNIQUE ("score"), CONSTRAINT "UQ_483a6adaf636e520039e97ef617" UNIQUE ("otpId"), CONSTRAINT "UQ_b61c694cacfab25533bd23d9add" UNIQUE ("agentId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "slug" character varying NOT NULL, "show" boolean NOT NULL, "imageKey" character varying NOT NULL, "imageUrl" character varying NOT NULL, "parentId" uuid, "created_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_cb73208f151aa71cdd78f662d70" UNIQUE ("slug"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "supplier_otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "expires_in" TIMESTAMP NOT NULL, "supplierId" uuid NOT NULL, "created_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_65d22567046d4a713b2fe0ca86" UNIQUE ("supplierId"), CONSTRAINT "PK_9c8e2cec13e59019728da5505ff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "supplier_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "image" character varying NOT NULL, "supplierId" uuid NOT NULL, CONSTRAINT "PK_ebaa5bf1c3d5c4d8eaa9e3f6595" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "supplier_document" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "document" character varying NOT NULL, "supplierId" uuid NOT NULL, CONSTRAINT "PK_a17d958ea91151abe3e049a4b04" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "supplier_contract" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contract" character varying NOT NULL, "supplierId" character varying NOT NULL, CONSTRAINT "PK_8674fde5613c1ac01519e67cfac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "supplier" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying, "national_code" character varying, "status" character varying DEFAULT 'registered', "is_mobile_verified" boolean DEFAULT false, "city" character varying NOT NULL, "store_name" character varying NOT NULL, "invite_code" character varying NOT NULL, "otpId" uuid, "categoryId" uuid, "agentId" character varying, "created_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "REL_f93bbb8ccb3547ad2b6f2f1de5" UNIQUE ("otpId"), CONSTRAINT "PK_2bc0d2cab6276144d2ff98a2828" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_otp" ADD CONSTRAINT "FK_bd81461d078fe46743dd535fb27" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" ADD CONSTRAINT "FK_1abd8badc4a127b0f357d9ecbc2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10" FOREIGN KEY ("parentId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_otp" ADD CONSTRAINT "FK_65d22567046d4a713b2fe0ca86b" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_image" ADD CONSTRAINT "FK_5bb4a0b8344cc68d6751f78bbac" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_document" ADD CONSTRAINT "FK_057b5967e70639aa0920ddaca6e" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "supplier_document" DROP CONSTRAINT "FK_057b5967e70639aa0920ddaca6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_image" DROP CONSTRAINT "FK_5bb4a0b8344cc68d6751f78bbac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_otp" DROP CONSTRAINT "FK_65d22567046d4a713b2fe0ca86b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" DROP CONSTRAINT "FK_1abd8badc4a127b0f357d9ecbc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_otp" DROP CONSTRAINT "FK_bd81461d078fe46743dd535fb27"`,
    );
    await queryRunner.query(`DROP TABLE "supplier"`);
    await queryRunner.query(`DROP TABLE "supplier_contract"`);
    await queryRunner.query(`DROP TABLE "supplier_document"`);
    await queryRunner.query(`DROP TABLE "supplier_image"`);
    await queryRunner.query(`DROP TABLE "supplier_otp"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "user_address"`);
    await queryRunner.query(`DROP TABLE "user_otp"`);
  }
}
