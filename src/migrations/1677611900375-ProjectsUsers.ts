import { MigrationInterface, QueryRunner } from "typeorm";

export class ProjectsUsers1677611900375 implements MigrationInterface {
    name = 'ProjectsUsers1677611900375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects_users" ("id" SERIAL NOT NULL, "user_id" integer, "project_id" integer, "role_id" integer, CONSTRAINT "PK_3fdba03cb5a1887699cb7c629f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2bdf8b14b34ac191f9fa6c6767" ON "projects_users" ("user_id", "project_id") `);
        await queryRunner.query(`ALTER TABLE "projects_users" ADD CONSTRAINT "FK_274bd757ae91379bf033a2daccd" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects_users" ADD CONSTRAINT "FK_b7d782db86a3dc1bd3b7eaed1fd" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects_users" ADD CONSTRAINT "FK_1dd57fc4e12c975eaaf3b01b988" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects_users" DROP CONSTRAINT "FK_1dd57fc4e12c975eaaf3b01b988"`);
        await queryRunner.query(`ALTER TABLE "projects_users" DROP CONSTRAINT "FK_b7d782db86a3dc1bd3b7eaed1fd"`);
        await queryRunner.query(`ALTER TABLE "projects_users" DROP CONSTRAINT "FK_274bd757ae91379bf033a2daccd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2bdf8b14b34ac191f9fa6c6767"`);
        await queryRunner.query(`DROP TABLE "projects_users"`);
    }

}
