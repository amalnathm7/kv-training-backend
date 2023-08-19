import { MigrationInterface, QueryRunner } from "typeorm";

export class AddressMapping1692445426820 implements MigrationInterface {
    name = 'AddressMapping1692445426820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "referral" ADD "address_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "referral" ADD CONSTRAINT "UQ_1a8686fe9fb466d2fcde46558f7" UNIQUE ("address_id")`);
        await queryRunner.query(`ALTER TABLE "referral" ADD CONSTRAINT "FK_1a8686fe9fb466d2fcde46558f7" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "referral" DROP CONSTRAINT "FK_1a8686fe9fb466d2fcde46558f7"`);
        await queryRunner.query(`ALTER TABLE "referral" DROP CONSTRAINT "UQ_1a8686fe9fb466d2fcde46558f7"`);
        await queryRunner.query(`ALTER TABLE "referral" DROP COLUMN "address_id"`);
    }

}
