import { MigrationInterface, QueryRunner } from 'typeorm'

export class newLocalRoles1686586161573 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO "permission"
      (name, is_global, description, "group", operation) values
      ('team:update', false, 'Change team in project', 'team', 'update'),
      ('boards:create', false, 'Create boards', 'boards', 'create'),
      ('boards:update', false, 'Update boards', 'boards', 'update'),
      ('boards:delete', false, 'Delete boards', 'boards', 'delete'),
      ('stages:create', false, 'Create stages', 'stages', 'create'),
      ('stages:delete', false, 'Delete stages', 'stages', 'delete'),
      ('stages:update', false, 'Update and move stages', 'stages', 'update'),
      ('tasks:create', false, 'Create tasks', 'tasks', 'create'),
      ('tasks:delete', false, 'Delete tasks', 'tasks', 'delete'),
      ('tasks:update', false, 'Update tasks', 'tasks', 'update'),
      ('tasks:move', false, 'Move tasks', 'tasks', 'move'),
      ('assignees:update', false, 'Add or delete task assignees', 'assignees', 'edit')
    `)

    await queryRunner.query(`
  INSERT INTO roles_permissions (role_id, permission_id)
  SELECT r.id, p.id
  FROM role r
  JOIN permission p ON r.name = 'Project Owner'
  WHERE p.is_global = false
    AND p.id IN (
      SELECT id FROM permission
      WHERE name IN (
        'team:update',
        'boards:create',
        'boards:update',
        'boards:delete',
        'stages:create',
        'stages:delete',
        'stages:update',
        'tasks:create',
        'tasks:delete',
        'tasks:update',
        'tasks:move',
        'assignees:update'
      )
    );
`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
