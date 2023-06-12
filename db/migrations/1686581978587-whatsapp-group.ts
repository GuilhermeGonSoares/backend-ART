import { MigrationInterface, QueryRunner } from "typeorm";

export class WhatsappGroup1686581978587 implements MigrationInterface {
    name = 'WhatsappGroup1686581978587'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "whatsapp_entity" ("id" SERIAL NOT NULL, "customer_id" integer NOT NULL, "groupId" character varying NOT NULL, "linkGroup" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e6cb15efcfd9607ba66021955d1" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "whatsapp_entity"`);
    }

}
