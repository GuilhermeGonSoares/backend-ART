import { MigrationInterface, QueryRunner } from "typeorm";

export class WhatsappGroup1686582919736 implements MigrationInterface {
    name = 'WhatsappGroup1686582919736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "whatsapp_entity" ADD CONSTRAINT "UQ_cd6eae33dffe470dbc922bbea9c" UNIQUE ("customer_id")`);
        await queryRunner.query(`ALTER TABLE "whatsapp_entity" ADD CONSTRAINT "FK_cd6eae33dffe470dbc922bbea9c" FOREIGN KEY ("customer_id") REFERENCES "customers"("cnpj") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "whatsapp_entity" DROP CONSTRAINT "FK_cd6eae33dffe470dbc922bbea9c"`);
        await queryRunner.query(`ALTER TABLE "whatsapp_entity" DROP CONSTRAINT "UQ_cd6eae33dffe470dbc922bbea9c"`);
    }

}
