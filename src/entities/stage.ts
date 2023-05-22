import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Board } from './board'
import { Task } from './task'

@Entity()
@Index(['slug', 'board'], { unique: true })
export class Stage {
  constructor(data: Partial<Stage>) {
    Object.assign(this, data)
  }
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  slug: string

  @Column()
  name: string

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
