import { MigrationInterface, QueryRunner } from "typeorm";

export class ChargeRelations1686327880512 implements MigrationInterface {
    name = 'ChargeRelations1686327880512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_98a4e1e3025f768de1493ecedec"`);
        await queryRunner.query(`ALTER TABLE "charges" DROP CONSTRAINT "FK_84b5b0838a9a5b11e064d74b63a"`);
        await queryRunner.query(`ALTER TABLE "charges" DROP CONSTRAINT "FK_c2282fa42f50f907afb1a97be8b"`);
        await queryRunner.query(`ALTER TABLE "charges" ALTER COLUMN "product_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_98a4e1e3025f768de1493ecedec" FOREIGN KEY ("customer_id") REFERENCES "customers"("cnpj") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "charges" ADD CONSTRAINT "FK_84b5b0838a9a5b11e064d74b63a" FOREIGN KEY ("customer_id") REFERENCES "customers"("cnpj") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "charges" ADD CONSTRAINT "FK_c2282fa42f50f907afb1a97be8b" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" DROP CONSTRAINT "FK_c2282fa42f50f907afb1a97be8b"`);
        await queryRunner.query(`ALTER TABLE "charges" DROP CONSTRAINT "FK_84b5b0838a9a5b11e064d74b63a"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_98a4e1e3025f768de1493ecedec"`);
        await queryRunner.query(`ALTER TABLE "charges" ALTER COLUMN "product_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "charges" ADD CONSTRAINT "FK_c2282fa42f50f907afb1a97be8b" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "charges" ADD CONSTRAINT "FK_84b5b0838a9a5b11e064d74b63a" FOREIGN KEY ("customer_id") REFERENCES "customers"("cnpj") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_98a4e1e3025f768de1493ecedec" FOREIGN KEY ("customer_id") REFERENCES "customers"("cnpj") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
