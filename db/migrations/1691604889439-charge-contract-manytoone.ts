import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChargeContractManytoone1691604889439
  implements MigrationInterface
{
  name = 'ChargeContractManytoone1691604889439';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "charges" DROP CONSTRAINT "FK_c115e5a0b1b3263688186698701"`,
    );
    await queryRunner.query(
      `ALTER TABLE "charges" DROP CONSTRAINT "REL_c115e5a0b1b326368818669870"`,
    );
    await queryRunner.query(
      `ALTER TABLE "charges" ADD CONSTRAINT "FK_c115e5a0b1b3263688186698701" FOREIGN KEY ("contract_id") REFERENCES "autentique_contract"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "charges" DROP CONSTRAINT "FK_c115e5a0b1b3263688186698701"`,
    );
    await queryRunner.query(
      `ALTER TABLE "charges" ADD CONSTRAINT "REL_c115e5a0b1b326368818669870" UNIQUE ("contract_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "charges" ADD CONSTRAINT "FK_c115e5a0b1b3263688186698701" FOREIGN KEY ("contract_id") REFERENCES "autentique_contract"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
