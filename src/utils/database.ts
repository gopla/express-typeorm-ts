require('dotenv').config()
import { createConnection, getConnection, getRepository } from 'typeorm'
import userUtils from '../api/user/user.utils'
import { User } from '../api/user/user.entity'
import { Post } from '../api/post/post.entity'

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env

export async function connectDB() {
  return await createConnection({
    type: 'mysql',
    host: DB_HOST,
    port: 3306,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
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
