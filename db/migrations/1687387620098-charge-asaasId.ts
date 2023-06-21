import { MigrationInterface, QueryRunner } from "typeorm";

export class ChargeAsaasId1687387620098 implements MigrationInterface {
    name = 'ChargeAsaasId1687387620098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" ADD "asaas_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "charges" ALTER COLUMN "payment_status" SET DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" ALTER COLUMN "payment_status" SET DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "charges" DROP COLUMN "asaas_id"`);
    }

}
