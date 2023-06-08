import { MigrationInterface, QueryRunner } from "typeorm";

export class PreferredDueDateToNumber1686261313134 implements MigrationInterface {
    name = 'PreferredDueDateToNumber1686261313134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "preferred_due_date"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "preferred_due_date" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "preferred_due_date"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "preferred_due_date" TIMESTAMP NOT NULL`);
    }

}
