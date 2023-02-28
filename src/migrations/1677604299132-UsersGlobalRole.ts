import { MigrationInterface, QueryRunner } from 'typeorm'

export class UsersGlobalRole1677604299132 implements MigrationInterface {
  name = 'UsersGlobalRole1677604299132'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "global_role_id" integer NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_4788a31935c8867d6cc7381e79b" FOREIGN KEY ("global_role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_4788a31935c8867d6cc7381e79b"`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "global_role_id"`)
  }
}
