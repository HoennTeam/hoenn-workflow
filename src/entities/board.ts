import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
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
  title: string

  @Column()
  flag: boolean

  @ManyToOne(() => Project, (project) => project.boards)
  project: Project

  @Column()
  tasks: Task[]

  @Column()
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
