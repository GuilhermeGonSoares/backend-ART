import { MigrationInterface, QueryRunner } from "typeorm";

export class ChargeDiscountZeroDefault1686332231099 implements MigrationInterface {
    name = 'ChargeDiscountZeroDefault1686332231099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" ALTER COLUMN "discount" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" ALTER COLUMN "discount" DROP DEFAULT`);
    }

}
