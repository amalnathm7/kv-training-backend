import { MigrationInterface, QueryRunner } from "typeorm";

export class FixEmployeeReferredBy1692876140444 implements MigrationInterface {
    name = 'FixEmployeeReferredBy1692876140444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_94f5ee8ab01e6f404378b33456f"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "UQ_94f5ee8ab01e6f404378b33456f"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_94f5ee8ab01e6f404378b33456f" FOREIGN KEY ("referred_by_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_94f5ee8ab01e6f404378b33456f"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "UQ_94f5ee8ab01e6f404378b33456f" UNIQUE ("referred_by_id")`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_94f5ee8ab01e6f404378b33456f" FOREIGN KEY ("referred_by_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
