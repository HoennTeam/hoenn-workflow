export interface RoleDto {
  readonly id: number
  readonly name: string
  readonly description: string
  readonly isGlobal: boolean
  readonly isImmutable: boolean

  readonly createdAt: string
  readonly updatedAt: string
}
