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
import { ProjectsUsers } from './projects-users'
import { User } from './user'

@Entity()
export class Role {
  constructor(data: Partial<Role>) {
    Object.assign(this, data)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string
  @Column({ default: false })
  isGlobal: boolean

  @Column()
  description: string

  @Column({ default: false })
  isImmutable: boolean

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({ name: 'roles_permissions' })
  permissions: Permission[]

  @OneToMany(() => User, (user) => user.globalRole)
  users: User[]

  @OneToMany(() => ProjectsUsers, (projectsUsers) => projectsUsers.role)
  projectsUsers: ProjectsUsers[]

  @CreateDateColumn()
  createdAt: Date
  @UpdateDateColumn()
  updatedAt: Date
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date
}
