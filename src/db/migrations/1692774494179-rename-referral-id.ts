import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameReferralId1692774494179 implements MigrationInterface {
    name = 'RenameReferralId1692774494179'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" RENAME COLUMN "referral_id" TO "candidate_code"`);
        await queryRunner.query(`ALTER TABLE "candidate" RENAME CONSTRAINT "UQ_c81d9e841df55ca48cfe87a9bca" TO "UQ_fe788a0e566137062b9cbfe09a4"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" RENAME CONSTRAINT "UQ_fe788a0e566137062b9cbfe09a4" TO "UQ_c81d9e841df55ca48cfe87a9bca"`);
        await queryRunner.query(`ALTER TABLE "candidate" RENAME COLUMN "candidate_code" TO "referral_id"`);
    }

}
