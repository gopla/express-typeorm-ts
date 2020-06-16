require('dotenv').config()
import { connectTestDB, closeDB, mockingDBRecord } from '../../utils/database'
import { expect } from 'chai'
import app from '../../app'
import supertest from 'supertest'
import jwt from 'jsonwebtoken'

const request = supertest(app)

describe('User test', () => {
  beforeAll(async () => {
    await connectTestDB()
    await mockingDBRecord()
  })

  afterAll(async () => await closeDB())

  it('Can create new user', async () => {
    const postUser = await request.post('/user').send({
      name: 'Created',
      username: 'created',
      password: '123',
    })

    expect(postUser.body).to.have.property('name', 'Created')
    expect(postUser.body).to.have.property('username', 'created')
    expect(postUser.body).to.have.property('password').not.equal('123')
  })

  it('Can authenticate user', async () => {
    const loginUser = await request.post('/user/login').send({
      username: 'created',
      password: '123',
    })

    expect(loginUser.body).to.have.property('isSuccess', true)
    expect(loginUser.body.token).to.be.a('string')

    const userData = jwt.decode(loginUser.body.token)
    expect(userData).to.include({
      id: 2,
      name: 'Created',
      username: 'created',
    })
  })

  it('Can prevent same username', async () => {
    const userBody = await request.post('/user').send({
      name: 'Created',
      username: 'created',
      password: '123',
    })

    expect(userBody.body).to.have.deep.equal({
      message: 'Username already exist',
      status: 'error',
      statusCode: 301,
    })
  })

  it('Can show error message on Username or Password', async () => {
    const unameMsg = await request.post('/user/login').send({
      username: 'creat',
      password: '123',
    })

    expect(unameMsg.body).to.have.deep.equal({
      message: 'Username not found',
      status: 'error',
      statusCode: 404,
    })

    const passMsg = await request.post('/user/login').send({
      username: 'created',
      password: '1234',
    })

    expect(passMsg.body).to.have.deep.equal({
      message: 'Wrong password',
      status: 'error',
      statusCode: 302,
    })
  })
})
