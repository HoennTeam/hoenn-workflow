export interface PermissionDto {
  readonly name: string
  readonly description: string
  readonly isGlobal: boolean
  readonly group: string
  readonly operation: string
  readonly enabled: boolean
}
