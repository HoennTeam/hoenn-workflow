import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Role } from './role'

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string
  @Column({ default: false })
  isGlobal: boolean

  @Column()
  description: string

  @Column()
  group: string
  @Column()
  operation: string

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[]
}
