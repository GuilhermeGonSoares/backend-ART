import { MigrationInterface, QueryRunner } from "typeorm";

export class PriceNumeric1694808929396 implements MigrationInterface {
    name = 'PriceNumeric1694808929396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "charges" ADD "price" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "charges" DROP COLUMN "discount"`);
        await queryRunner.query(`ALTER TABLE "charges" ADD "discount" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "charges" DROP COLUMN "final_price"`);
        await queryRunner.query(`ALTER TABLE "charges" ADD "final_price" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "price" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "discount"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "discount" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "extra_costs"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "extra_costs" numeric(10,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "extra_costs"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "extra_costs" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "discount"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "discount" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "charges" DROP COLUMN "final_price"`);
        await queryRunner.query(`ALTER TABLE "charges" ADD "final_price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "charges" DROP COLUMN "discount"`);
        await queryRunner.query(`ALTER TABLE "charges" ADD "discount" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "charges" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "charges" ADD "price" integer NOT NULL`);
    }

}
