import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../user/user.entity'

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @Column('text')
  post: string

  @ManyToOne((type) => User, (user) => user.id, { eager: true })
  user: User
}
