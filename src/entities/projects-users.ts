import {
  Entity,
  Index,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Project } from './project'
import { Role } from './role'
import { User } from './user'

@Entity()
@Index(['user', 'project'], { unique: true })
export class ProjectsUsers {
  constructor(data: Partial<ProjectsUsers>) {
    Object.assign(this, data)
  }

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.projectsUsers)
  user: User

  @ManyToOne(() => Project, (project) => project.projectsUsers)
  project: Project

  @ManyToOne(() => Role, (role) => role.projectsUsers)
  @JoinTable()
  role: Role
}
