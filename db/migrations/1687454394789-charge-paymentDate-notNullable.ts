import { MigrationInterface, QueryRunner } from "typeorm";

export class ChargePaymentDateNotNullable1687454394789 implements MigrationInterface {
    name = 'ChargePaymentDateNotNullable1687454394789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" ALTER COLUMN "payment_date" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" ALTER COLUMN "payment_date" DROP NOT NULL`);
    }

}
