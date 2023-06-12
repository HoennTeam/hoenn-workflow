import { MigrationInterface, QueryRunner } from 'typeorm'

export class ViewerGlobalRole1686586343634 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO roles_permissions (role_id, permission_id)
    SELECT r.id, p.id
    FROM role r
    JOIN permission p ON r.name = 'Viewer'
    WHERE p.name = 'project:read';
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
