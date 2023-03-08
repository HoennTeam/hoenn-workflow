import { MigrationInterface, QueryRunner } from 'typeorm'

export class StageNoTitle1677613644834 implements MigrationInterface {
  name = 'StageNoTitle1677613644834'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stage" RENAME COLUMN "title" TO "name"`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stage" RENAME COLUMN "name" TO "title"`
    )
  }
}
