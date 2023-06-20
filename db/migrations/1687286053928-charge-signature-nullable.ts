import { MigrationInterface, QueryRunner } from "typeorm";

export class ChargeSignatureNullable1687286053928 implements MigrationInterface {
    name = 'ChargeSignatureNullable1687286053928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" ALTER COLUMN "signatureStatus" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "charges" ALTER COLUMN "signatureStatus" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "charges" ALTER COLUMN "signatureStatus" SET DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "charges" ALTER COLUMN "signatureStatus" SET NOT NULL`);
    }

}
