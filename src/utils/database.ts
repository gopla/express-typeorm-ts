require('dotenv').config()
import { createConnection, getConnection, getRepository } from 'typeorm'
import userUtils from '../api/user/user.utils'
import { User } from '../api/user/user.entity'
import { Post } from '../api/post/post.entity'

export async function connectDB() {
  return await createConnection({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'db_type',
    synchronize: true,
    logging: false,
    entities: ['./build/api/**/**.entity.js'],
  })
}

export async function connectTestDB() {
  return await createConnection({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    synchronize: true,
    logging: false,
    entities: ['./src/api/**/**.entity.ts'],
  })
}

export async function mockingDBRecord() {
  const hashPass = await userUtils.hash('123')
  await getRepository(User).save({
    name: 'gopla',
    username: 'gopla',
    password: hashPass,
  })

  await getRepository(Post).save({
    userId: 1,
    post: 'pertamax',
  })
}

export async function closeDB() {
  return await getConnection().close()
}
