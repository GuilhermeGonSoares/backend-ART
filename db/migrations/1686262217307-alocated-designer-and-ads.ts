import { MigrationInterface, QueryRunner } from "typeorm";

export class AlocatedDesignerAndAds1686262217307 implements MigrationInterface {
    name = 'AlocatedDesignerAndAds1686262217307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "alocated_designer" character varying`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "alocated_ads" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "alocated_ads"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "alocated_designer"`);
    }

}
