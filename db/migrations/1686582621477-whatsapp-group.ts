import { MigrationInterface, QueryRunner } from "typeorm";

export class WhatsappGroup1686582621477 implements MigrationInterface {
    name = 'WhatsappGroup1686582621477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "whatsapp_entity" DROP COLUMN "customer_id"`);
        await queryRunner.query(`ALTER TABLE "whatsapp_entity" ADD "customer_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "whatsapp_entity" DROP COLUMN "customer_id"`);
        await queryRunner.query(`ALTER TABLE "whatsapp_entity" ADD "customer_id" integer NOT NULL`);
    }

}
