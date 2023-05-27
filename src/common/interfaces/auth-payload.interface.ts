export interface AuthPayload {
  readonly id: number
  readonly username: string
  readonly fullName: string
  readonly email: string
  readonly roleName: string
  readonly permissions: string[]
}
