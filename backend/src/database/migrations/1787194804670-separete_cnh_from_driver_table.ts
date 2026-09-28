import { MigrationInterface, QueryRunner } from "typeorm";

export class SepareteCnhFromDriverTable1787194804670 implements MigrationInterface {
    name = 'SepareteCnhFromDriverTable1787194804670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."cnhs_status_enum" AS ENUM('ACTIVE', 'SUSPENDED', 'REVOKED', 'EXPIRED')`);
        await queryRunner.query(`CREATE TABLE "cnhs" ("id" uuid NOT NULL, "number" character varying NOT NULL, "issue_date" date NOT NULL, "expiry_date" date NOT NULL, "categories" json NOT NULL DEFAULT '[]', "restrictions" json NOT NULL DEFAULT '[]', "status" "public"."cnhs_status_enum" NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fdd2a618c43f31d1914b84a3c6c" UNIQUE ("number"), CONSTRAINT "PK_7257901a490f64e4cc044e9c61d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "UQ_cf4414c4fbe5d5f6d1fae5dc911"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "cnh_number"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "cnh_issue_date"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "cnh_expiry_date"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "cnh_categories"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "cnh_restrictions"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "cnh_status"`);
        await queryRunner.query(`DROP TYPE "public"."drivers_cnh_status_enum"`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "cnh_id" uuid`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD CONSTRAINT "UQ_6ab593d2e48a2f3d996eca5106a" UNIQUE ("cnh_id")`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD CONSTRAINT "FK_6ab593d2e48a2f3d996eca5106a" FOREIGN KEY ("cnh_id") REFERENCES "cnhs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "FK_6ab593d2e48a2f3d996eca5106a"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "UQ_6ab593d2e48a2f3d996eca5106a"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "cnh_id"`);
        await queryRunner.query(`CREATE TYPE "public"."drivers_cnh_status_enum" AS ENUM('ACTIVE', 'SUSPENDED', 'REVOKED', 'EXPIRED')`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "cnh_status" "public"."drivers_cnh_status_enum" NOT NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "cnh_restrictions" json NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "cnh_categories" json NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "cnh_expiry_date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "cnh_issue_date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "cnh_number" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD CONSTRAINT "UQ_cf4414c4fbe5d5f6d1fae5dc911" UNIQUE ("cnh_number")`);
        await queryRunner.query(`DROP TABLE "cnhs"`);
        await queryRunner.query(`DROP TYPE "public"."cnhs_status_enum"`);
    }

}
