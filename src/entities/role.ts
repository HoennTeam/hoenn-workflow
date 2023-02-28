import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Permission } from './permission'
import { User } from './user'

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string
  @Column({ default: false })
  isGlobal: boolean

  @Column()
  description: string

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({ name: 'roles_permissions' })
  permissions: Permission[]

  @OneToMany(() => User, (user) => user.globalRole)
  users: User[]

  @CreateDateColumn()
  createdAt: Date
  @UpdateDateColumn()
  updatedAt: Date
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date
}
