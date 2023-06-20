import { MigrationInterface, QueryRunner } from "typeorm";

export class Autentique1687290509694 implements MigrationInterface {
    name = 'Autentique1687290509694'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "autentique_contract" ALTER COLUMN "autentique_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" DROP CONSTRAINT "UQ_3d9ddb6cd2ab497eb338841ebf8"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "autentique_contract" ADD CONSTRAINT "UQ_3d9ddb6cd2ab497eb338841ebf8" UNIQUE ("autentique_id")`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" ALTER COLUMN "autentique_id" SET NOT NULL`);
    }

}
