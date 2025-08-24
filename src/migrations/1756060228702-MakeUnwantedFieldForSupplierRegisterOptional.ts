import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeUnwantedFieldForSupplierRegisterOptional1756060228702
  implements MigrationInterface
{
  name = 'MakeUnwantedFieldForSupplierRegisterOptional1756060228702';

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
      `CREATE TABLE "supplier_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "image" character varying NOT NULL, "supplierId" uuid NOT NULL, CONSTRAINT "PK_ebaa5bf1c3d5c4d8eaa9e3f6595" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "supplier_document" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "document" character varying NOT NULL, "supplierId" uuid NOT NULL, CONSTRAINT "PK_a17d958ea91151abe3e049a4b04" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_otp" ADD CONSTRAINT "FK_bd81461d078fe46743dd535fb27" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" ADD CONSTRAINT "FK_1abd8badc4a127b0f357d9ecbc2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_image" ADD CONSTRAINT "FK_5bb4a0b8344cc68d6751f78bbac" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_document" ADD CONSTRAINT "FK_057b5967e70639aa0920ddaca6e" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "supplier_document" DROP CONSTRAINT "FK_057b5967e70639aa0920ddaca6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_image" DROP CONSTRAINT "FK_5bb4a0b8344cc68d6751f78bbac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" DROP CONSTRAINT "FK_1abd8badc4a127b0f357d9ecbc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_otp" DROP CONSTRAINT "FK_bd81461d078fe46743dd535fb27"`,
    );
    await queryRunner.query(`DROP TABLE "supplier_document"`);
    await queryRunner.query(`DROP TABLE "supplier_image"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "user_address"`);
    await queryRunner.query(`DROP TABLE "user_otp"`);
  }
}
