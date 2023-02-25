# Models

## Instance

```ts
class Instance {
  id: number

  name: string
  createdAt: Date
  administratorEmail: string
  administrator: User // root root
}
```

## User

```ts
class User {
  id: number

  username: string
  password: string

  oneTimePassword: boolean

  fullName: string
  email: string

  globalRole: Role

  avatar: string

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
```

## Project

```ts
class Project {
  id: number

  name: string
  description: string

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
```

## Permission

```ts
class Permission {
  id: number

  name: string
  description: string

  group: string
  operation: string

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
```

## Role

```ts
class Role {
  id: number

  name: string
  description: string
  permissions: Permission
}
```

## ProjectUsers

```ts
class ProjectUsers {
  project: Project
  user: User
  role: Role

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
```

## Boards

## Stages

## Tasks

