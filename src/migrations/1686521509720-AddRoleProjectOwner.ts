import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddRoleProjectOwner1686521509720 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO "role"
      (name, is_global, description) values
      ('Project Owner', false, 'Owner')`)
    await queryRunner.query(
      `UPDATE "role" SET is_immutable=true WHERE name IN ('Project Owner')`
    )
    await queryRunner.query(
      `UPDATE "role" SET is_immutable=true WHERE name IN ('Project Owner')`
    )
    await queryRunner.query(`INSERT INTO roles_permissions (role_id, permission_id)
    SELECT r.id, p.id
    FROM role r
    JOIN permission p ON r.name = 'Project Owner'
    WHERE p.is_global IS FALSE;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
