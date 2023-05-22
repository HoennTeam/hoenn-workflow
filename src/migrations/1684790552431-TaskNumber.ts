import { MigrationInterface, QueryRunner } from 'typeorm'

export class TaskNumber1684790552431 implements MigrationInterface {
  name = 'TaskNumber1684790552431'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" ADD "number" integer`)
    await queryRunner.query('UPDATE "task" SET "number"="id"')
    await queryRunner.query(
      'ALTER TABLE "task" ALTER COLUMN "number" SET NOT NULL'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "number"`)
  }
}
