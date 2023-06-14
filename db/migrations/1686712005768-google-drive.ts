import { MigrationInterface, QueryRunner } from "typeorm";

export class GoogleDrive1686712005768 implements MigrationInterface {
    name = 'GoogleDrive1686712005768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "google_drive" ("id" SERIAL NOT NULL, "customer_id" character varying NOT NULL, "folderId" character varying NOT NULL, "link" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_be73f4a8d94cf76bfc7cebbbed" UNIQUE ("customer_id"), CONSTRAINT "PK_49f1158b3c124db854b13b80105" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "google_drive" ADD CONSTRAINT "FK_be73f4a8d94cf76bfc7cebbbede" FOREIGN KEY ("customer_id") REFERENCES "customers"("cnpj") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "google_drive" DROP CONSTRAINT "FK_be73f4a8d94cf76bfc7cebbbede"`);
        await queryRunner.query(`DROP TABLE "google_drive"`);
    }

}
