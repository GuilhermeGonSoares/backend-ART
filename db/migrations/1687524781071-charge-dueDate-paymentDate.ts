import { MigrationInterface, QueryRunner } from "typeorm";

export class ChargeDueDatePaymentDate1687524781071 implements MigrationInterface {
    name = 'ChargeDueDatePaymentDate1687524781071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" ADD "due_date" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "charges" ALTER COLUMN "payment_date" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" ALTER COLUMN "payment_date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "charges" DROP COLUMN "due_date"`);
    }

}
