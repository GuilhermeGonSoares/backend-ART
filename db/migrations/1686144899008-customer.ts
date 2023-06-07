import { MigrationInterface, QueryRunner } from "typeorm";

export class Customer1686144899008 implements MigrationInterface {
    name = 'Customer1686144899008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customers" ("cnpj" character varying(14) NOT NULL, "name" character varying NOT NULL, "city" character varying NOT NULL, "uf" character(2) NOT NULL, "main_phone" character varying(12) NOT NULL, "finance_phone" character varying(12) NOT NULL, "finance_email" character varying NOT NULL, "instagram_profile" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e25f7bf72237b287e0cc9e60192" PRIMARY KEY ("cnpj"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "customers"`);
    }

}
