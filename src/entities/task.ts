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
import { Board } from './board'
import { Stage } from './stage'

@Entity()
export class Task {
  constructor(data: Partial<Task>) {
    Object.assign(this, data)
  }
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  number: number

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  index: number

  @ManyToOne(() => Stage, (stage) => stage.tasks)
  stage: Stage

  @ManyToOne(() => Board, (board) => board.tasks)
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
