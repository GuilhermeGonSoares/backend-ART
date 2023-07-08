import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeDriveWhats1688819487948 implements MigrationInterface {
    name = 'CascadeDriveWhats1688819487948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "whatsapp_entity" DROP CONSTRAINT "FK_cd6eae33dffe470dbc922bbea9c"`);
        await queryRunner.query(`ALTER TABLE "google_drive" DROP CONSTRAINT "FK_be73f4a8d94cf76bfc7cebbbede"`);
        await queryRunner.query(`ALTER TABLE "whatsapp_entity" ADD CONSTRAINT "FK_cd6eae33dffe470dbc922bbea9c" FOREIGN KEY ("customer_id") REFERENCES "customers"("cnpj") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "google_drive" ADD CONSTRAINT "FK_be73f4a8d94cf76bfc7cebbbede" FOREIGN KEY ("customer_id") REFERENCES "customers"("cnpj") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "google_drive" DROP CONSTRAINT "FK_be73f4a8d94cf76bfc7cebbbede"`);
        await queryRunner.query(`ALTER TABLE "whatsapp_entity" DROP CONSTRAINT "FK_cd6eae33dffe470dbc922bbea9c"`);
        await queryRunner.query(`ALTER TABLE "google_drive" ADD CONSTRAINT "FK_be73f4a8d94cf76bfc7cebbbede" FOREIGN KEY ("customer_id") REFERENCES "customers"("cnpj") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "whatsapp_entity" ADD CONSTRAINT "FK_cd6eae33dffe470dbc922bbea9c" FOREIGN KEY ("customer_id") REFERENCES "customers"("cnpj") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
