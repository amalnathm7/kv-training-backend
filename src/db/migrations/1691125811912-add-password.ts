import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPassword1691125811912 implements MigrationInterface {
    name = 'AddPassword1691125811912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_817d1d427138772d47eca04885" ON "employee" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_817d1d427138772d47eca04885"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "password"`);
    }

}
