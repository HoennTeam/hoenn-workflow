import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm'
import { ProjectsUsers } from './projects-users'
import { Role } from './role'
import { Task } from './task'

@Entity()
export class User {
  constructor(data: Partial<User>) {
    Object.assign(this, data)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @Column({
    default: '',
  })
  bio: string

  @Column({ default: true })
  requiredPasswordChange: boolean

  @Column()
  fullName: string

  @Column({ unique: true })
  email: string

  @ManyToOne(() => Role, (role) => role.users, {
    nullable: false,
    cascade: ['insert', 'update'],
  })
  globalRole: Role

  @OneToMany(() => ProjectsUsers, (projectsUsers) => projectsUsers.user)
  projectsUsers: ProjectsUsers[]

  @ManyToMany(() => Task, (assignedTask) => assignedTask.assignees)
  assignedTasks: Task[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date
}
