export interface RoleDto {
  readonly id: number
  readonly name: string
  readonly description: string
  readonly isGlobal: boolean

  readonly createdAt: string
  readonly updateAt: string
}
