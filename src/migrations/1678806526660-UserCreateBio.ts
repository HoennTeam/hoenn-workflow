import { MigrationInterface, QueryRunner } from "typeorm";

export class UserCreateBio1678806526660 implements MigrationInterface {
    name = 'UserCreateBio1678806526660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "bio" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bio"`);
    }

}
