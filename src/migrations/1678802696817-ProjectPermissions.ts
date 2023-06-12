import { MigrationInterface, QueryRunner } from 'typeorm'

export class ProjectPermissions1678802696817 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "roles_permissions"`)
    await queryRunner.query(`DELETE FROM "permission"`)

    await queryRunner.query(`INSERT INTO "permission"
      (name, is_global, description, "group", operation) values
      ('profile:read', true, 'Read personal profile', 'profile', 'read'),
      ('profile:update', true, 'Modify personal profile', 'profile', 'update'),
      ('users:create', true, 'Create user accounts', 'users', 'create'),
      ('users:read', true, 'View basic users information', 'users', 'read'),
      ('users:read:full', true, 'View full users information', 'users', 'read:full'),
      ('users:update', true, 'Modify any user information', 'users', 'update'),
      ('users:delete', true, 'Delete users', 'users', 'delete'),
      ('users:update:role', true, 'Change users roles', 'users', 'update:role'),
      ('instance:update', true, 'Modify instance information', 'instance', 'update'),
      ('roles:create', true, 'Create roles', 'roles', 'create'),
      ('roles:read', true, 'View roles', 'roles', 'read'),
      ('roles:update', true, 'Modify roles info and permissions', 'roles', 'update'),
      ('roles:delete', true, 'Delete roles', 'roles', 'delete'),
      ('projects:create', true, 'Create projects', 'projects', 'create'),
      ('projects:read', true, 'Read all projects', 'projects', 'read'),
      ('projects:update', true, 'Update any project', 'projects', 'update'),
      ('projects:delete', true, 'Delete any project', 'projects', 'delete')
    `)

    await queryRunner.query(`INSERT INTO "permission"
      (name, is_global, description, "group", operation) values
      ('project:read', false, 'Read project', 'project', 'read'),
      ('project:update', false, 'Update project info', 'project', 'update'),
      ('project:delete', false, 'Delete project', 'project', 'delete')
    `)

    await queryRunner.query(`INSERT INTO "roles_permissions"
      (role_id, permission_id)
      select 1, id from "permission"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
