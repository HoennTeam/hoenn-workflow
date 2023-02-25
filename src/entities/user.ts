import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'

@Entity()
export class User {
  constructor(data: Partial<User>) {
    Object.assign(this, data)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  username: string
  @Column()
  password: string

  @Column({ default: true })
  requiredPasswordChange: boolean

  @Column()
  fullName: string
  @Column({ unique: true })
  email: string

  @CreateDateColumn()
  createdAt: Date
  @UpdateDateColumn()
  updatedAt: Date
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date
}
