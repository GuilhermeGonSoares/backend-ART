import { MigrationInterface, QueryRunner } from "typeorm";

export class Autentique1687291571859 implements MigrationInterface {
    name = 'Autentique1687291571859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "autentique_contract" DROP CONSTRAINT "FK_1c8f30ed847862076e2b1b383cb"`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" DROP CONSTRAINT "REL_1c8f30ed847862076e2b1b383c"`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" DROP COLUMN "subscription_id"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "contract_id" integer`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "UQ_4bbb4fd07de799fb45f9ff3eb8c" UNIQUE ("contract_id")`);
        await queryRunner.query(`ALTER TABLE "charges" ADD "contract_id" integer`);
        await queryRunner.query(`ALTER TABLE "charges" ADD CONSTRAINT "UQ_c115e5a0b1b3263688186698701" UNIQUE ("contract_id")`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_4bbb4fd07de799fb45f9ff3eb8c" FOREIGN KEY ("contract_id") REFERENCES "autentique_contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "charges" ADD CONSTRAINT "FK_c115e5a0b1b3263688186698701" FOREIGN KEY ("contract_id") REFERENCES "autentique_contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" DROP CONSTRAINT "FK_c115e5a0b1b3263688186698701"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_4bbb4fd07de799fb45f9ff3eb8c"`);
        await queryRunner.query(`ALTER TABLE "charges" DROP CONSTRAINT "UQ_c115e5a0b1b3263688186698701"`);
        await queryRunner.query(`ALTER TABLE "charges" DROP COLUMN "contract_id"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "UQ_4bbb4fd07de799fb45f9ff3eb8c"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "contract_id"`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" ADD "subscription_id" integer`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" ADD CONSTRAINT "REL_1c8f30ed847862076e2b1b383c" UNIQUE ("subscription_id")`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" ADD CONSTRAINT "FK_1c8f30ed847862076e2b1b383cb" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
