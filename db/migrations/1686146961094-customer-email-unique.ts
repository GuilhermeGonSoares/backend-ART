import { MigrationInterface, QueryRunner } from "typeorm";

export class CustomerEmailUnique1686146961094 implements MigrationInterface {
    name = 'CustomerEmailUnique1686146961094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "UQ_82ca2831159fef503587a46c605" UNIQUE ("finance_email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "UQ_82ca2831159fef503587a46c605"`);
    }

}
