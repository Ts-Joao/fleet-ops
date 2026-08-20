import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableDriver1786647621687 implements MigrationInterface {
    name = 'AddTableDriver1786647621687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."drivers_cnh_status_enum" AS ENUM('ACTIVE', 'SUSPENDED', 'REVOKED', 'EXPIRED')`);
        await queryRunner.query(`CREATE TABLE "drivers" ("id" uuid NOT NULL, "name" character varying NOT NULL, "birth_date" date NOT NULL, "cnh_number" character varying NOT NULL, "cnh_issue_date" date NOT NULL, "cnh_expiry_date" date NOT NULL, "cnh_categories" json NOT NULL DEFAULT '[]', "cnh_restrictions" json NOT NULL DEFAULT '[]', "cnh_status" "public"."drivers_cnh_status_enum" NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_92ab3fb69e566d3eb0cae896047" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "drivers"`);
        await queryRunner.query(`DROP TYPE "public"."drivers_cnh_status_enum"`);
    }

}
