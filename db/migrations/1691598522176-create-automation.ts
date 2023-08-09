import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAutomation1691598522176 implements MigrationInterface {
    name = 'CreateAutomation1691598522176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "google_drive" DROP CONSTRAINT "FK_be73f4a8d94cf76bfc7cebbbede"`);
        await queryRunner.query(`ALTER TABLE "whatsapp_entity" DROP CONSTRAINT "FK_cd6eae33dffe470dbc922bbea9c"`);
        await queryRunner.query(`CREATE TABLE "automations" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "service_id" integer NOT NULL, "initial_date" TIMESTAMP NOT NULL, "isCreateGroup" boolean NOT NULL, "isCreateDrive" boolean NOT NULL, "isAutentique" boolean NOT NULL, CONSTRAINT "PK_34c2cc382fc780ea36f7c478192" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "google_drive" ADD CONSTRAINT "FK_be73f4a8d94cf76bfc7cebbbede" FOREIGN KEY ("customer_id") REFERENCES "customers"("cnpj") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "whatsapp_entity" ADD CONSTRAINT "FK_cd6eae33dffe470dbc922bbea9c" FOREIGN KEY ("customer_id") REFERENCES "customers"("cnpj") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "whatsapp_entity" DROP CONSTRAINT "FK_cd6eae33dffe470dbc922bbea9c"`);
        await queryRunner.query(`ALTER TABLE "google_drive" DROP CONSTRAINT "FK_be73f4a8d94cf76bfc7cebbbede"`);
        await queryRunner.query(`DROP TABLE "automations"`);
        await queryRunner.query(`ALTER TABLE "whatsapp_entity" ADD CONSTRAINT "FK_cd6eae33dffe470dbc922bbea9c" FOREIGN KEY ("customer_id") REFERENCES "customers"("cnpj") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "google_drive" ADD CONSTRAINT "FK_be73f4a8d94cf76bfc7cebbbede" FOREIGN KEY ("customer_id") REFERENCES "customers"("cnpj") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
