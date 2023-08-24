import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBonusStatusColumnToReferrals1692886006076 implements MigrationInterface {
    name = 'AddBonusStatusColumnToReferrals1692886006076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" ADD "bonus_status" character varying NOT NULL DEFAULT 'Inactive'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" DROP COLUMN "bonus_status"`);
    }

}
