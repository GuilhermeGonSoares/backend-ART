import { MigrationInterface, QueryRunner } from "typeorm";

export class Autentique1687287286997 implements MigrationInterface {
    name = 'Autentique1687287286997'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "autentique_contract" ("contract_id" character varying NOT NULL, "signature_status" character varying NOT NULL DEFAULT 'pending', "charge_id" integer, "subscription_id" integer, CONSTRAINT "REL_1c8f30ed847862076e2b1b383c" UNIQUE ("subscription_id"), CONSTRAINT "REL_8269f56bca65104fb88442a068" UNIQUE ("charge_id"), CONSTRAINT "PK_3870b79c31ebc142fdffbe139f1" PRIMARY KEY ("contract_id"))`);
        await queryRunner.query(`ALTER TABLE "charges" DROP COLUMN "contract_id"`);
        await queryRunner.query(`ALTER TABLE "charges" DROP COLUMN "signatureStatus"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "contract_id"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "signatureStatus"`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" ADD CONSTRAINT "FK_1c8f30ed847862076e2b1b383cb" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" ADD CONSTRAINT "FK_8269f56bca65104fb88442a0681" FOREIGN KEY ("charge_id") REFERENCES "charges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "autentique_contract" DROP CONSTRAINT "FK_8269f56bca65104fb88442a0681"`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" DROP CONSTRAINT "FK_1c8f30ed847862076e2b1b383cb"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "signatureStatus" character varying NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "contract_id" character varying`);
        await queryRunner.query(`ALTER TABLE "charges" ADD "signatureStatus" character varying`);
        await queryRunner.query(`ALTER TABLE "charges" ADD "contract_id" character varying`);
        await queryRunner.query(`DROP TABLE "autentique_contract"`);
    }

}
