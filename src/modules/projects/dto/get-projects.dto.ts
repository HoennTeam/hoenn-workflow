import { ApiProperty } from '@nestjs/swagger'

export interface GetProjectsResponseDto {
  readonly id: number
  readonly title: string
  readonly boards: {
    readonly id: number
    readonly name: string
    readonly createdAt: Date
    readonly updatedAt: Date
  }[]
  readonly createdAt: Date
  readonly updatedAt: Date
}
