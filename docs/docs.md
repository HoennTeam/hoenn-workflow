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

  boards: Board[]

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

```ts
class Board {
  id: number
  title: string
  flag: boolean //default board have only one flag true
  tasks: Task[]
  stages: Stage[]
  createdAt: Date
  updatedAt: Date
  deletedAt: Date?
}
```

## Stages

```ts
class Stage {
  id: number
  title: string
  tasks: Task[]
}
```

## Tasks

```ts
class Task {
  id: number
  title: string
  assignees: User[]
  description: string
  stage: Stage
  createdAt: Date
  updatedAt: Date
  deletedAt: Date?
}
```
