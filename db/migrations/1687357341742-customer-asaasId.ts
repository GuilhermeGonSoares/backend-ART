import { MigrationInterface, QueryRunner } from "typeorm";

export class CustomerAsaasId1687357341742 implements MigrationInterface {
    name = 'CustomerAsaasId1687357341742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" ADD "asaas_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "asaas_id"`);
    }

}
