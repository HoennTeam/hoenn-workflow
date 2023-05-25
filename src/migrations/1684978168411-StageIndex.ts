import { MigrationInterface, QueryRunner } from 'typeorm'

export class StageIndex1684978168411 implements MigrationInterface {
  name = 'StageIndex1684978168411'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "stage" ADD "index" integer`)
    await queryRunner.query(`UPDATE "stage" SET index=id`)
    await queryRunner.query(
      `ALTER TABLE "stage" ALTER COLUMN "index" SET NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "stage" DROP COLUMN "index"`)
  }
}
