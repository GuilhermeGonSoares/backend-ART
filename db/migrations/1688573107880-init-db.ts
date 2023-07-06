import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1688573107880 implements MigrationInterface {
    name = 'InitDb1688573107880'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "autentique_contract" ("id" SERIAL NOT NULL, "autentique_id" character varying, "signature_status" character varying NOT NULL DEFAULT 'pending', "type" character varying NOT NULL, CONSTRAINT "PK_38a3dc7d8b8df9a6f98a60f51d6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "charges" ("id" SERIAL NOT NULL, "customer_id" character varying NOT NULL, "product_id" integer, "asaas_id" character varying, "subscription_id" integer, "price" integer NOT NULL, "discount" integer NOT NULL DEFAULT '0', "final_price" integer NOT NULL, "contract_id" integer, "due_date" TIMESTAMP NOT NULL, "payment_type" character varying NOT NULL, "payment_status" character varying NOT NULL DEFAULT 'PENDING', "payment_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_c115e5a0b1b326368818669870" UNIQUE ("contract_id"), CONSTRAINT "PK_0c6feb10df0fa460714f8464dce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contracts" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "file_id" character varying NOT NULL, CONSTRAINT "UQ_4c5fd33d0a8e1ff7c4886d16551" UNIQUE ("name"), CONSTRAINT "PK_2c7b8f3a7b1acdd49497d83d0fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "contract_id" integer, "name" character varying NOT NULL, "description" character varying NOT NULL, "price" integer NOT NULL, "type" character varying NOT NULL, "number_of_posts" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4c9fb58de893725258746385e16" UNIQUE ("name"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscriptions" ("id" SERIAL NOT NULL, "customer_id" character varying NOT NULL, "product_id" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "alocated_designer" character varying, "alocated_ads" character varying, "price" integer NOT NULL, "discount" integer NOT NULL DEFAULT '0', "extra_costs" integer NOT NULL DEFAULT '0', "preferred_due_date" integer NOT NULL, "payment_type" character varying NOT NULL DEFAULT 'BOLETO', "contract_id" integer, "initial_date" TIMESTAMP NOT NULL, "finished_date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_4bbb4fd07de799fb45f9ff3eb8" UNIQUE ("contract_id"), CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customers" ("cnpj" character varying(14) NOT NULL, "name" character varying NOT NULL, "asaas_id" character varying NOT NULL, "city" character varying NOT NULL, "uf" character(2) NOT NULL, "main_phone" character varying(12) NOT NULL, "finance_phone" character varying(12) NOT NULL, "finance_email" character varying NOT NULL, "instagram_profile" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_82ca2831159fef503587a46c605" UNIQUE ("finance_email"), CONSTRAINT "PK_e25f7bf72237b287e0cc9e60192" PRIMARY KEY ("cnpj"))`);
        await queryRunner.query(`CREATE TABLE "google_drive" ("id" SERIAL NOT NULL, "customer_id" character varying NOT NULL, "folderId" character varying NOT NULL, "link" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5a645a3db74266b006351eef7d2" UNIQUE ("folderId"), CONSTRAINT "REL_be73f4a8d94cf76bfc7cebbbed" UNIQUE ("customer_id"), CONSTRAINT "PK_49f1158b3c124db854b13b80105" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "whatsapp_entity" ("id" SERIAL NOT NULL, "customer_id" character varying NOT NULL, "groupId" character varying NOT NULL, "linkGroup" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_cd6eae33dffe470dbc922bbea9" UNIQUE ("customer_id"), CONSTRAINT "PK_e6cb15efcfd9607ba66021955d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "charges" ADD CONSTRAINT "FK_84b5b0838a9a5b11e064d74b63a" FOREIGN KEY ("customer_id") REFERENCES "customers"("cnpj") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "charges" ADD CONSTRAINT "FK_c2282fa42f50f907afb1a97be8b" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "charges" ADD CONSTRAINT "FK_c115e5a0b1b3263688186698701" FOREIGN KEY ("contract_id") REFERENCES "autentique_contract"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "charges" ADD CONSTRAINT "FK_07accc5ce9fdb6faf1af3e486ae" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_38287dc61e9b4afa7879edf8352" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_98a4e1e3025f768de1493ecedec" FOREIGN KEY ("customer_id") REFERENCES "customers"("cnpj") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_b7f78362e96be1edd6203e047f6" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_4bbb4fd07de799fb45f9ff3eb8c" FOREIGN KEY ("contract_id") REFERENCES "autentique_contract"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "google_drive" ADD CONSTRAINT "FK_be73f4a8d94cf76bfc7cebbbede" FOREIGN KEY ("customer_id") REFERENCES "customers"("cnpj") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "whatsapp_entity" ADD CONSTRAINT "FK_cd6eae33dffe470dbc922bbea9c" FOREIGN KEY ("customer_id") REFERENCES "customers"("cnpj") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "whatsapp_entity" DROP CONSTRAINT "FK_cd6eae33dffe470dbc922bbea9c"`);
        await queryRunner.query(`ALTER TABLE "google_drive" DROP CONSTRAINT "FK_be73f4a8d94cf76bfc7cebbbede"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_4bbb4fd07de799fb45f9ff3eb8c"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_b7f78362e96be1edd6203e047f6"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_98a4e1e3025f768de1493ecedec"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_38287dc61e9b4afa7879edf8352"`);
        await queryRunner.query(`ALTER TABLE "charges" DROP CONSTRAINT "FK_07accc5ce9fdb6faf1af3e486ae"`);
        await queryRunner.query(`ALTER TABLE "charges" DROP CONSTRAINT "FK_c115e5a0b1b3263688186698701"`);
        await queryRunner.query(`ALTER TABLE "charges" DROP CONSTRAINT "FK_c2282fa42f50f907afb1a97be8b"`);
        await queryRunner.query(`ALTER TABLE "charges" DROP CONSTRAINT "FK_84b5b0838a9a5b11e064d74b63a"`);
        await queryRunner.query(`DROP TABLE "whatsapp_entity"`);
        await queryRunner.query(`DROP TABLE "google_drive"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "contracts"`);
        await queryRunner.query(`DROP TABLE "charges"`);
        await queryRunner.query(`DROP TABLE "autentique_contract"`);
    }

}
