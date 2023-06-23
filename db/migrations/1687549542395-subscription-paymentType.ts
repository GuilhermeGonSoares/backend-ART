import { MigrationInterface, QueryRunner } from "typeorm";

export class SubscriptionPaymentType1687549542395 implements MigrationInterface {
    name = 'SubscriptionPaymentType1687549542395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "payment_type" character varying NOT NULL DEFAULT 'BOLETO'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "payment_type"`);
    }

}
