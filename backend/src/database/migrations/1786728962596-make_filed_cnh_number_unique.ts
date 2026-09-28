import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeFiledCnhNumberUnique1786728962596 implements MigrationInterface {
    name = 'MakeFiledCnhNumberUnique1786728962596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drivers" ADD CONSTRAINT "UQ_cf4414c4fbe5d5f6d1fae5dc911" UNIQUE ("cnh_number")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "UQ_cf4414c4fbe5d5f6d1fae5dc911"`);
    }

}
