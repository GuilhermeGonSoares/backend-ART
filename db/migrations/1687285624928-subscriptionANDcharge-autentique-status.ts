import { MigrationInterface, QueryRunner } from "typeorm";

export class SubscriptionANDchargeAutentiqueStatus1687285624928 implements MigrationInterface {
    name = 'SubscriptionANDchargeAutentiqueStatus1687285624928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" ADD "contract_id" character varying`);
        await queryRunner.query(`ALTER TABLE "charges" ADD "signatureStatus" character varying NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "signatureStatus" character varying NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "signatureStatus"`);
        await queryRunner.query(`ALTER TABLE "charges" DROP COLUMN "signatureStatus"`);
        await queryRunner.query(`ALTER TABLE "charges" DROP COLUMN "contract_id"`);
    }

}
