import { MigrationInterface, QueryRunner } from "typeorm";

export class Charge1686326980972 implements MigrationInterface {
    name = 'Charge1686326980972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "charges" ("id" SERIAL NOT NULL, "customer_id" character varying NOT NULL, "product_id" integer NOT NULL, "price" integer NOT NULL, "discount" integer NOT NULL, "final_price" integer NOT NULL, "payment_type" character varying NOT NULL, "payment_status" character varying NOT NULL, "payment_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "customerCnpj" character varying(14), "productId" integer, CONSTRAINT "PK_0c6feb10df0fa460714f8464dce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "charges" ADD CONSTRAINT "FK_19250e406da74978023c1acad6c" FOREIGN KEY ("customerCnpj") REFERENCES "customers"("cnpj") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "charges" ADD CONSTRAINT "FK_71f981d767fcd73eb74fc510120" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" DROP CONSTRAINT "FK_71f981d767fcd73eb74fc510120"`);
        await queryRunner.query(`ALTER TABLE "charges" DROP CONSTRAINT "FK_19250e406da74978023c1acad6c"`);
        await queryRunner.query(`DROP TABLE "charges"`);
    }

}
