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

  it('Can get all user', async () => {
    const getAllUser = await request.get('/user').send()

    expect(getAllUser.body).to.have.length(1)
  })

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
      statusCode: 302,
      isSuccess: false,
      message: 'Username already exist',
    })
  })

  it('Can show error message on Username or Password', async () => {
    const unameMsg = await request.post('/user/login').send({
      username: 'creat',
      password: '123',
    })

    expect(unameMsg.body).to.have.deep.equal({
      statusCode: 404,
      isSuccess: false,
      message: 'Username not found',
    })

    const passMsg = await request.post('/user/login').send({
      username: 'created',
      password: '1234',
    })

    expect(passMsg.body).to.have.deep.equal({
      statusCode: 302,
      isSuccess: false,
      message: 'Wrong password',
    })
  })

  it('Can get user by username', async () => {
    const getByUsername = await request.get('/user/gopla')

    expect(getByUsername.body[0]).to.have.deep.include({
      id: 1,
      name: 'gopla',
      username: 'gopla',
    })
    expect(getByUsername.body[0]).to.have.property('password').not.equal('123')
  })

  it('Can update user', async () => {
    const updateUser = await request.put('/user/2').send({
      name: 'naufalyudhistira',
      username: 'naufalyudhistira',
      password: '123',
    })

    expect(updateUser.body).to.have.deep.equal({
      isSuccess: true,
      message: 'User updated',
    })
  })

  it('Can delete user', async () => {
    const deleteUser = await request.delete('/user/2').send()

    expect(deleteUser.body).to.have.deep.equal({
      isSuccess: true,
      message: 'User deleted',
    })
  })
})
