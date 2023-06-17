import { MigrationInterface, QueryRunner } from "typeorm";

export class SubscriptionStatus1686973637303 implements MigrationInterface {
    name = 'SubscriptionStatus1686973637303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" RENAME COLUMN "active" TO "status"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "status" character varying NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "subscriptions" RENAME COLUMN "status" TO "active"`);
    }

}
