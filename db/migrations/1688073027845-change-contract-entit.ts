import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeContractEntit1688073027845 implements MigrationInterface {
    name = 'ChangeContractEntit1688073027845'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" RENAME COLUMN "file_path" TO "file_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" RENAME COLUMN "file_id" TO "file_path"`);
    }

}
