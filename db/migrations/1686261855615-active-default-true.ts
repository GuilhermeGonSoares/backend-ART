import { MigrationInterface, QueryRunner } from "typeorm";

export class ActiveDefaultTrue1686261855615 implements MigrationInterface {
    name = 'ActiveDefaultTrue1686261855615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "active" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "active" DROP DEFAULT`);
    }

}
