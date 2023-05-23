import { MigrationInterface, QueryRunner } from 'typeorm'

export class TaskIndex1684791812422 implements MigrationInterface {
  name = 'TaskIndex1684791812422'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" ADD "index" integer`)
    await queryRunner.query('UPDATE "task" SET "index"="id"')
    await queryRunner.query(
      'ALTER TABLE "task" ALTER COLUMN "index" SET NOT NULL'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "index"`)
  }
}
