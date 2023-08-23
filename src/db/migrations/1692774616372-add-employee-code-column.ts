import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmployeeCodeColumn1692774616372 implements MigrationInterface {
    name = 'AddEmployeeCodeColumn1692774616372'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ADD "employee_code" character varying(6) NOT NULL DEFAULT nanoid(6)`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "UQ_45af99d6ae576d97ca2bfa9142d" UNIQUE ("employee_code")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "UQ_45af99d6ae576d97ca2bfa9142d"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "employee_code"`);
    }

}
