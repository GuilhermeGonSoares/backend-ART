import { MigrationInterface, QueryRunner } from "typeorm";

export class Contract1686766429487 implements MigrationInterface {
    name = 'Contract1686766429487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contracts" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "file" bytea, CONSTRAINT "UQ_4c5fd33d0a8e1ff7c4886d16551" UNIQUE ("name"), CONSTRAINT "PK_2c7b8f3a7b1acdd49497d83d0fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD "contract_id" integer`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_38287dc61e9b4afa7879edf8352" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_38287dc61e9b4afa7879edf8352"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "contract_id"`);
        await queryRunner.query(`DROP TABLE "contracts"`);
    }

}
