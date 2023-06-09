import { MigrationInterface, QueryRunner } from "typeorm";

export class PriceSubscription1686328530606 implements MigrationInterface {
    name = 'PriceSubscription1686328530606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "price" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "price"`);
    }

}
