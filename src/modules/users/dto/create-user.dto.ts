export interface CreateUserDto {
  readonly username: string
  readonly fullName: string
  readonly email: string
}

export interface CreateUserOutDto {
  readonly username: string
  readonly fullName: string
  readonly email: string
  readonly password: string
  readonly roleName: string
  readonly createdAt: string
  readonly updatedAt: string
}
