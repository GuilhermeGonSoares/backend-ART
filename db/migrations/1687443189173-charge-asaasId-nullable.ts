import { MigrationInterface, QueryRunner } from "typeorm";

export class ChargeAsaasIdNullable1687443189173 implements MigrationInterface {
    name = 'ChargeAsaasIdNullable1687443189173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" ALTER COLUMN "asaas_id" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" ALTER COLUMN "asaas_id" SET NOT NULL`);
    }

}
