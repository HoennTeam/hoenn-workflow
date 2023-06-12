export const PERMISSIONS = {
  PROFILE: {
    READ: 'profile:read',
    UPDATE: 'profile:update',
  },
  USERS: {
    CREATE: 'users:create',
    READ: 'users:read',
    READ_FULL: 'users:read:full',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
    UPDATE_ROLE: 'users:update:role',
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
  PROJECTS: {
    CREATE: 'projects:create',
    READ: 'project:read',
    UPDATE: 'project:update',
    DELETE: 'projects:delete',
  },
} as const

export const PROJECT_PERMISSIONS = {
  PROJECT: {
    READ: 'project:read',
    UPDATE: 'project:update',
    DELETE: 'project:delete',
  },
  TEAM: {
    UPDATE: 'team:update',
  },
  BOARDS: {
    CREATE: 'boards:create',
    UPDATE: 'boards:update',
    DELETE: 'boards:delete',
  },
  STAGES: {
    CREATE: 'stages:create',
    UPDATE: 'stages:update',
    DELETE: 'stages:delete',
  },
  TASKS: {
    CREATE: 'tasks:create',
    UPDATE: 'tasks:update',
    DELETE: 'tasks:delete',
    MOVE: 'tasks:move',
  },
  ASSIGNEES: {
    UPDATE: 'assignees:update',
  },
}
