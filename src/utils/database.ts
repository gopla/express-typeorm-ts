import { createConnection, getConnection, getRepository } from 'typeorm'
import userUtils from '../api/user/user.utils'
import { User } from '../api/user/user.entity'

export async function connectDB() {
  return await createConnection()
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
}

export async function closeDB() {
  return await getConnection().close()
}
