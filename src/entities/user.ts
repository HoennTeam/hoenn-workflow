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
import { ProjectsUsers } from './projects-users'
import { Role } from './role'

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

  @Column({
    default: '',
  })
  bio: string

  @Column({ default: true })
  requiredPasswordChange: boolean

  @Column()
  fullName: string

  @Column({ unique: true })
  email: string

  @ManyToOne(() => Role, (role) => role.users, {
    nullable: false,
    cascade: true,
  })
  globalRole: Role

  @OneToMany(() => ProjectsUsers, (projectsUsers) => projectsUsers.user)
  projectsUsers: ProjectsUsers[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date
}
