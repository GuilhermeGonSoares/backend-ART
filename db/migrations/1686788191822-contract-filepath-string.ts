import { MigrationInterface, QueryRunner } from "typeorm";

export class ContractFilepathString1686788191822 implements MigrationInterface {
    name = 'ContractFilepathString1686788191822'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" RENAME COLUMN "filePath" TO "file_path"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "file_path"`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD "file_path" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "file_path"`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD "file_path" bytea`);
        await queryRunner.query(`ALTER TABLE "contracts" RENAME COLUMN "file_path" TO "filePath"`);
    }

}
