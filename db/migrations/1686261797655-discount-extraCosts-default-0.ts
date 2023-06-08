import { MigrationInterface, QueryRunner } from "typeorm";

export class DiscountExtraCostsDefault01686261797655 implements MigrationInterface {
    name = 'DiscountExtraCostsDefault01686261797655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "discount" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "extra_costs" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "extra_costs" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "discount" DROP DEFAULT`);
    }

}
