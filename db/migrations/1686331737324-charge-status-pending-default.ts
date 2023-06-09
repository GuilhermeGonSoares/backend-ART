import { MigrationInterface, QueryRunner } from "typeorm";

export class ChargeStatusPendingDefault1686331737324 implements MigrationInterface {
    name = 'ChargeStatusPendingDefault1686331737324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" ALTER COLUMN "payment_status" SET DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" ALTER COLUMN "payment_status" DROP DEFAULT`);
    }

}
