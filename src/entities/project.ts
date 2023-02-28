import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm'
import { Board } from './board'
import { ProjectsUsers } from './projects-users'

@Entity()
export class Project {
  constructor(data: Partial<Project>) {
    Object.assign(this, data)
  }
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @OneToMany(() => Board, (boards) => boards.project, { cascade: true })
  boards: Board[]

  @OneToMany(() => ProjectsUsers, (projectsUsers) => projectsUsers.project)
  projectsUsers: ProjectsUsers[]

  @CreateDateColumn()
  createdAt: Date
  @UpdateDateColumn()
  updatedAt: Date
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date
}
