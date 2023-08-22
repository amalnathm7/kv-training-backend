import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameReferralToCandidate1692709339582 implements MigrationInterface {
    name = 'RenameReferralToCandidate1692709339582'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "candidate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "email" character varying NOT NULL, "experience" integer NOT NULL, "phone" character varying NOT NULL, "status" character varying NOT NULL, "resume" character varying NOT NULL, "referral_id" character varying(6) NOT NULL DEFAULT nanoid(6), "referred_by_id" uuid, "address_id" uuid NOT NULL, "role_id" uuid, "opening_id" uuid, CONSTRAINT "UQ_c81d9e841df55ca48cfe87a9bca" UNIQUE ("referral_id"), CONSTRAINT "REL_55d42eb6a33d968fedb611a2a7" UNIQUE ("address_id"), CONSTRAINT "PK_b0ddec158a9a60fbc785281581b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "candidate" ADD CONSTRAINT "FK_fea12478b7d008d3b013ab1bf1f" FOREIGN KEY ("referred_by_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidate" ADD CONSTRAINT "FK_55d42eb6a33d968fedb611a2a73" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidate" ADD CONSTRAINT "FK_45ee214e09de0bee4c69f2e3e1a" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidate" ADD CONSTRAINT "FK_b84339646750dffd80409cf8dca" FOREIGN KEY ("opening_id") REFERENCES "opening"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" DROP CONSTRAINT "FK_b84339646750dffd80409cf8dca"`);
        await queryRunner.query(`ALTER TABLE "candidate" DROP CONSTRAINT "FK_45ee214e09de0bee4c69f2e3e1a"`);
        await queryRunner.query(`ALTER TABLE "candidate" DROP CONSTRAINT "FK_55d42eb6a33d968fedb611a2a73"`);
        await queryRunner.query(`ALTER TABLE "candidate" DROP CONSTRAINT "FK_fea12478b7d008d3b013ab1bf1f"`);
        await queryRunner.query(`DROP TABLE "candidate"`);
    }

}
