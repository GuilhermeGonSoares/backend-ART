import { MigrationInterface, QueryRunner } from "typeorm";

export class Subscription1686261192919 implements MigrationInterface {
    name = 'Subscription1686261192919'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subscriptions" ("id" SERIAL NOT NULL, "customer_id" character varying NOT NULL, "product_id" integer NOT NULL, "active" boolean NOT NULL, "discount" integer NOT NULL, "extra_costs" integer NOT NULL, "preferred_due_date" TIMESTAMP NOT NULL, "initial_date" TIMESTAMP NOT NULL, "finished_date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_98a4e1e3025f768de1493ecedec" FOREIGN KEY ("customer_id") REFERENCES "customers"("cnpj") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_b7f78362e96be1edd6203e047f6" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_b7f78362e96be1edd6203e047f6"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_98a4e1e3025f768de1493ecedec"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
    }

}
