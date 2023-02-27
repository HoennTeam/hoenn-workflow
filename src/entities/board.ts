import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Project } from './project'
import { Stage } from './stage'
import { Task } from './task'

@Entity()
export class Board {
  constructor(data: Partial<Board>) {
    Object.assign(this, data)
  }
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  isDefault: boolean

  @ManyToOne(() => Project, (project) => project.boards)
  project: Project

  @OneToMany(() => Task, (tasks) => tasks.board)
  tasks: Task[]

  @OneToMany(() => Stage, (stages) => stages.board)
  stages: Stage[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt?: Date
}
