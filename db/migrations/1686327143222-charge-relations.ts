import { MigrationInterface, QueryRunner } from "typeorm";

export class ChargeRelations1686327143222 implements MigrationInterface {
    name = 'ChargeRelations1686327143222'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" DROP CONSTRAINT "FK_19250e406da74978023c1acad6c"`);
        await queryRunner.query(`ALTER TABLE "charges" DROP CONSTRAINT "FK_71f981d767fcd73eb74fc510120"`);
        await queryRunner.query(`ALTER TABLE "charges" DROP COLUMN "customerCnpj"`);
        await queryRunner.query(`ALTER TABLE "charges" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "charges" ADD CONSTRAINT "FK_84b5b0838a9a5b11e064d74b63a" FOREIGN KEY ("customer_id") REFERENCES "customers"("cnpj") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "charges" ADD CONSTRAINT "FK_c2282fa42f50f907afb1a97be8b" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" DROP CONSTRAINT "FK_c2282fa42f50f907afb1a97be8b"`);
        await queryRunner.query(`ALTER TABLE "charges" DROP CONSTRAINT "FK_84b5b0838a9a5b11e064d74b63a"`);
        await queryRunner.query(`ALTER TABLE "charges" ADD "productId" integer`);
        await queryRunner.query(`ALTER TABLE "charges" ADD "customerCnpj" character varying(14)`);
        await queryRunner.query(`ALTER TABLE "charges" ADD CONSTRAINT "FK_71f981d767fcd73eb74fc510120" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "charges" ADD CONSTRAINT "FK_19250e406da74978023c1acad6c" FOREIGN KEY ("customerCnpj") REFERENCES "customers"("cnpj") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
