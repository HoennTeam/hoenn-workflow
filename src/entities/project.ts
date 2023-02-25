import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { Task } from './task'

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @OneToMany(() => Board, (boards) => boards.project)
  boards: Board[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt: Date
}

@Entity()
export class Board {
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
  deletedAt: Date
}

@Entity()
export class Stage {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @OneToMany(() => Task, (tasks) => tasks.stage)
  tasks: Task
}
