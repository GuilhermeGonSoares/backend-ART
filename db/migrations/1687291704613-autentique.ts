import { MigrationInterface, QueryRunner } from "typeorm";

export class Autentique1687291704613 implements MigrationInterface {
    name = 'Autentique1687291704613'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "autentique_contract" DROP CONSTRAINT "FK_8269f56bca65104fb88442a0681"`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" DROP CONSTRAINT "REL_8269f56bca65104fb88442a068"`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" DROP COLUMN "charge_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "autentique_contract" ADD "charge_id" integer`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" ADD CONSTRAINT "REL_8269f56bca65104fb88442a068" UNIQUE ("charge_id")`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" ADD CONSTRAINT "FK_8269f56bca65104fb88442a0681" FOREIGN KEY ("charge_id") REFERENCES "charges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
