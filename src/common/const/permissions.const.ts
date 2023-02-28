export const PERMISSIONS = {
  USERS: {
    CREATE: 'users:create',
    READ: 'users:read',
    READ_FULL: 'users:read:full',
    UPDATE: 'users:update',
    UPDATE_SELF: 'users:update:self',
    DELETE: 'users:delete',
  },
  INSTANCE: {
    UPDATE: 'instance:update',
  },
  ROLES: {
    CREATE: 'roles:create',
    READ: 'roles:read',
    UPDATE: 'roles:update',
    DELETE: 'roles:delete',
  },
} as const
