import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRole1691137996067 implements MigrationInterface {
    name = 'AddRole1691137996067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ADD "role" character varying NOT NULL DEFAULT 'Developer'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "role"`);
    }

}
