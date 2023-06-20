import { MigrationInterface, QueryRunner } from "typeorm";

export class Autentique1687289044260 implements MigrationInterface {
    name = 'Autentique1687289044260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "autentique_contract" DROP CONSTRAINT "PK_3870b79c31ebc142fdffbe139f1"`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" DROP COLUMN "contract_id"`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" ADD CONSTRAINT "PK_38a3dc7d8b8df9a6f98a60f51d6" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" ADD "autentique_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" ADD CONSTRAINT "UQ_3d9ddb6cd2ab497eb338841ebf8" UNIQUE ("autentique_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "autentique_contract" DROP CONSTRAINT "UQ_3d9ddb6cd2ab497eb338841ebf8"`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" DROP COLUMN "autentique_id"`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" DROP CONSTRAINT "PK_38a3dc7d8b8df9a6f98a60f51d6"`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" ADD "contract_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "autentique_contract" ADD CONSTRAINT "PK_3870b79c31ebc142fdffbe139f1" PRIMARY KEY ("contract_id")`);
    }

}
