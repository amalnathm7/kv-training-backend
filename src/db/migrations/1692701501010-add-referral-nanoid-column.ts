import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReferralNanoidColumn1692701501010 implements MigrationInterface {
    name = 'AddReferralNanoidColumn1692701501010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "referral" ADD "referral_id" character varying(6) NOT NULL DEFAULT nanoid(6)`);
        await queryRunner.query(`ALTER TABLE "referral" ADD CONSTRAINT "UQ_7068562ecb32a3c7550f22f1bd8" UNIQUE ("referral_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "referral" DROP CONSTRAINT "UQ_7068562ecb32a3c7550f22f1bd8"`);
        await queryRunner.query(`ALTER TABLE "referral" DROP COLUMN "referral_id"`);
    }

}
