import { MigrationInterface, QueryRunner } from "typeorm";

export class AutentiqueType1687293836228 implements MigrationInterface {
    name = 'AutentiqueType1687293836228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_4bbb4fd07de799fb45f9ff3eb8c"`);
        await queryRunner.query(`ALTER TABLE "charges" DROP CONSTRAINT "FK_c115e5a0b1b3263688186698701"`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_4bbb4fd07de799fb45f9ff3eb8c" FOREIGN KEY ("contract_id") REFERENCES "autentique_contract"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "charges" ADD CONSTRAINT "FK_c115e5a0b1b3263688186698701" FOREIGN KEY ("contract_id") REFERENCES "autentique_contract"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" DROP CONSTRAINT "FK_c115e5a0b1b3263688186698701"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_4bbb4fd07de799fb45f9ff3eb8c"`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "charges" ADD CONSTRAINT "FK_c115e5a0b1b3263688186698701" FOREIGN KEY ("contract_id") REFERENCES "autentique_contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_4bbb4fd07de799fb45f9ff3eb8c" FOREIGN KEY ("contract_id") REFERENCES "autentique_contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
