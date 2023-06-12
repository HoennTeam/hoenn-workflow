import { MigrationInterface, QueryRunner } from 'typeorm'

export class DefaultProjectRole1685146313368 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO "role"
      (name, is_global, description) values
      ('Viewer', false, 'Project viewer')`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
