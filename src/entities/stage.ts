import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
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
}
