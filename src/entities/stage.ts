import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Board } from './board'
import { Task } from './task'

@Entity()
export class Stage {
  constructor(data: Partial<Stage>) {
    Object.assign(this, data)
  }
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @OneToMany(() => Task, (tasks) => tasks.stage)
  tasks: Task

  @ManyToOne(() => Board, (board) => board.stages)
  board: Board

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt?: Date
}
