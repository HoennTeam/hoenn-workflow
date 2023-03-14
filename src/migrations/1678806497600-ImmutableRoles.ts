import { MigrationInterface, QueryRunner } from 'typeorm'

export class ImmutableRoles1678806497600 implements MigrationInterface {
  name = 'ImmutableRoles1678806497600'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role" ADD "is_immutable" boolean NOT NULL DEFAULT false`
    )

    await queryRunner.query(
      `UPDATE "role" SET is_immutable=true WHERE name IN ('Administrator', 'Member')`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "is_immutable"`)
  }
}
