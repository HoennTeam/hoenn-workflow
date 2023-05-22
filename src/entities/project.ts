import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from 'typeorm'
import { Board } from './board'
import { ProjectsUsers } from './projects-users'

@Entity()
@Index('slug', { unique: true })
export class Project {
  constructor(data: Partial<Project>) {
    Object.assign(this, data)
  }
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 10 })
  slug: string

  @Column()
  name: string

  @Column()
  description: string

  @OneToMany(() => Board, (boards) => boards.project, {
    cascade: true,
  })
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
