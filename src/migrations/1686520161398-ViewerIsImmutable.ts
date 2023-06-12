import { MigrationInterface, QueryRunner } from 'typeorm'

export class ViewerIsImmutable1686520161398 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "role" SET is_immutable=true WHERE name IN ('Viewer')`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "role" SET is_immutable=false WHERE name IN ('Viewer')`
    )
  }
}
