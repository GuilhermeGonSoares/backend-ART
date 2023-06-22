import { MigrationInterface, QueryRunner } from "typeorm";

export class ChargeSubscriptionId1687453147638 implements MigrationInterface {
    name = 'ChargeSubscriptionId1687453147638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" ADD "subscription_id" integer`);
        await queryRunner.query(`ALTER TABLE "charges" ADD CONSTRAINT "FK_07accc5ce9fdb6faf1af3e486ae" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" DROP CONSTRAINT "FK_07accc5ce9fdb6faf1af3e486ae"`);
        await queryRunner.query(`ALTER TABLE "charges" DROP COLUMN "subscription_id"`);
    }

}
