import { MigrationInterface, QueryRunner } from "typeorm";

export class OpeningFieldsNonNullable1692439574097 implements MigrationInterface {
    name = 'OpeningFieldsNonNullable1692439574097'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "opening" DROP CONSTRAINT "FK_e2bd9c0654a8573b246b633127b"`);
        await queryRunner.query(`ALTER TABLE "opening" DROP CONSTRAINT "FK_44fe9cb93426e3887ba77208c33"`);
        await queryRunner.query(`ALTER TABLE "opening" ALTER COLUMN "department_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "opening" ALTER COLUMN "role_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "opening" ADD CONSTRAINT "FK_e2bd9c0654a8573b246b633127b" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "opening" ADD CONSTRAINT "FK_44fe9cb93426e3887ba77208c33" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "opening" DROP CONSTRAINT "FK_44fe9cb93426e3887ba77208c33"`);
        await queryRunner.query(`ALTER TABLE "opening" DROP CONSTRAINT "FK_e2bd9c0654a8573b246b633127b"`);
        await queryRunner.query(`ALTER TABLE "opening" ALTER COLUMN "role_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "opening" ALTER COLUMN "department_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "opening" ADD CONSTRAINT "FK_44fe9cb93426e3887ba77208c33" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "opening" ADD CONSTRAINT "FK_e2bd9c0654a8573b246b633127b" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
