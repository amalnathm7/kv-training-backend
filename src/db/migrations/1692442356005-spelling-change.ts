import { MigrationInterface, QueryRunner } from "typeorm";

export class SpellingChange1692442356005 implements MigrationInterface {
    name = 'SpellingChange1692442356005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "opening" RENAME COLUMN "descrption" TO "description"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "opening" RENAME COLUMN "description" TO "descrption"`);
    }

}
