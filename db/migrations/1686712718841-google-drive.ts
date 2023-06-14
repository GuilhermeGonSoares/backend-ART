import { MigrationInterface, QueryRunner } from "typeorm";

export class GoogleDrive1686712718841 implements MigrationInterface {
    name = 'GoogleDrive1686712718841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "google_drive" ADD CONSTRAINT "UQ_5a645a3db74266b006351eef7d2" UNIQUE ("folderId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "google_drive" DROP CONSTRAINT "UQ_5a645a3db74266b006351eef7d2"`);
    }

}
