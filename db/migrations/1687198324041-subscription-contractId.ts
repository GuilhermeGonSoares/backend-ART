import { MigrationInterface, QueryRunner } from "typeorm";

export class SubscriptionContractId1687198324041 implements MigrationInterface {
    name = 'SubscriptionContractId1687198324041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "contract_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "contract_id"`);
    }

}
