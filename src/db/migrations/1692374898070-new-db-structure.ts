

import { MigrationInterface, QueryRunner } from "typeorm";

​

export class NewDbStructure1692374898070 implements MigrationInterface {

    name = 'NewDbStructure1692374898070'

​

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "line1" character varying NOT NULL, "line2" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "country" character varying NOT NULL, "pincode" character varying NOT NULL, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);

        await queryRunner.query(`CREATE TABLE "department" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);

        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "role" character varying NOT NULL, "permission_level" integer NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);

        await queryRunner.query(`CREATE TABLE "opening" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "title" character varying NOT NULL, "descrption" character varying NOT NULL, "skills" character varying NOT NULL, "count" integer NOT NULL, "location" character varying NOT NULL, "experience" integer NOT NULL, "department_id" integer, "role_id" integer, CONSTRAINT "PK_8b433fbb5ac3bc1cda8afc64fa2" PRIMARY KEY ("id"))`);

        await queryRunner.query(`CREATE TABLE "referral" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "email" character varying NOT NULL, "experience" integer NOT NULL, "phone" character varying NOT NULL, "status" character varying NOT NULL, "resume" character varying NOT NULL, "referred_by_id" integer, "role_id" integer, "opening_id" integer, CONSTRAINT "PK_a2d3e935a6591168066defec5ad" PRIMARY KEY ("id"))`);

        await queryRunner.query(`CREATE TABLE "employee" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying NOT NULL, "joining_date" character varying NOT NULL, "experience" integer NOT NULL, "status" character varying NOT NULL, "department_id" integer, "role_id" integer, "address_id" integer NOT NULL, "referred_by_id" integer, CONSTRAINT "UQ_817d1d427138772d47eca048855" UNIQUE ("email"), CONSTRAINT "REL_2a4f5082f1be346e2b8cdec219" UNIQUE ("address_id"), CONSTRAINT "REL_94f5ee8ab01e6f404378b33456" UNIQUE ("referred_by_id"), CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`);

        await queryRunner.query(`ALTER TABLE "opening" ADD CONSTRAINT "FK_e2bd9c0654a8573b246b633127b" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "opening" ADD CONSTRAINT "FK_44fe9cb93426e3887ba77208c33" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "referral" ADD CONSTRAINT "FK_a4abe6e0c60678f43b269dde18d" FOREIGN KEY ("referred_by_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "referral" ADD CONSTRAINT "FK_6f05f9b90ea78c5623b9d9a8733" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "referral" ADD CONSTRAINT "FK_e6bfe27d6f696c282de223b0e39" FOREIGN KEY ("opening_id") REFERENCES "opening"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_d62835db8c0aec1d18a5a927549" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_1c105b756816efbdeae09a9ab65" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_2a4f5082f1be346e2b8cdec2194" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_94f5ee8ab01e6f404378b33456f" FOREIGN KEY ("referred_by_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

    }

​

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_94f5ee8ab01e6f404378b33456f"`);

        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_2a4f5082f1be346e2b8cdec2194"`);

        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_1c105b756816efbdeae09a9ab65"`);

        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_d62835db8c0aec1d18a5a927549"`);

        await queryRunner.query(`ALTER TABLE "referral" DROP CONSTRAINT "FK_e6bfe27d6f696c282de223b0e39"`);

        await queryRunner.query(`ALTER TABLE "referral" DROP CONSTRAINT "FK_6f05f9b90ea78c5623b9d9a8733"`);

        await queryRunner.query(`ALTER TABLE "referral" DROP CONSTRAINT "FK_a4abe6e0c60678f43b269dde18d"`);

        await queryRunner.query(`ALTER TABLE "opening" DROP CONSTRAINT "FK_44fe9cb93426e3887ba77208c33"`);

        await queryRunner.query(`ALTER TABLE "opening" DROP CONSTRAINT "FK_e2bd9c0654a8573b246b633127b"`);

        await queryRunner.query(`DROP TABLE "employee"`);

        await queryRunner.query(`DROP TABLE "referral"`);

        await queryRunner.query(`DROP TABLE "opening"`);

        await queryRunner.query(`DROP TABLE "role"`);

        await queryRunner.query(`DROP TABLE "department"`);

        await queryRunner.query(`DROP TABLE "address"`);

    }

​

}

