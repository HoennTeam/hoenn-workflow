import { MigrationInterface, QueryRunner } from 'typeorm'

export class DefaultPermissions1677593876243 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`INSERT INTO "permission"
      (name, is_global, description, "group", operation) values
      ('users:create', true, 'Create user accounts', 'users', 'create'),
      ('users:read', true, 'View basic users information', 'users', 'read'),
      ('users:read:full', true, 'View full users information', 'users', 'read:full'),
      ('users:update', true, 'Modify any user information', 'users', 'update'),
      ('users:update:self', true, 'Modify own user information', 'users', 'update:self'),
      ('users:delete', true, 'Delete users', 'users', 'delete'),
      ('instance:update', true, 'Modify instance information', 'instance', 'update'),
      ('roles:create', true, 'Create roles', 'roles', 'create'),
      ('roles:read', true, 'View roles', 'roles', 'read'),
      ('roles:update', true, 'Modify roles information', 'roles', 'update'),
      ('roles:delete', true, 'Delete roles', 'roles', 'delete')
        `)

    queryRunner.query(`INSERT INTO "role"
      (name, is_global, description) values
      ('Administrator', true, 'System administrator'),
      ('Member', true, 'User without permissions')`)

    queryRunner.query(`INSERT INTO "roles_permissions"
      (role_id, permission_id)
      select 1, id from "permission"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DELETE FROM "roles_permissions"`)
    queryRunner.query(`DELETE FROM "role"`)
    queryRunner.query(`DELETE FROM "permission"`)
  }
}
