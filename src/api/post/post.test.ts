require('dotenv').config()
import { connectTestDB, closeDB, mockingDBRecord } from '../../utils/database'
import { expect } from 'chai'
import app from '../../app'
import supertest from 'supertest'

const request = supertest(app)

const authenticate = async () => {
  const authenticateResponse = await request
    .post('/user/login')
    .send({ username: 'gopla', password: '123' })
  return authenticateResponse.body.token as string
}

describe('Post test', () => {
  beforeAll(async () => {
    await connectTestDB()
    await mockingDBRecord()
  })

  afterAll(async () => await closeDB())

  it('Can get all posts', async () => {
    const token = await authenticate()
    const getAllPost = await request
      .get('/post')
      .set('authorization', `bearer ${token}`)
      .send()

    expect(getAllPost.body).to.have.length(1)
  })

  it('Can create new post', async () => {
    const token = await authenticate()
    const createPost = await request
      .post('/post')
      .set('authorization', `bearer ${token}`)
      .send({ post: 'keduax' })

    expect(createPost.body).to.eql({
      userId: 1,
      id: 2,
      post: 'keduax',
    })
  })

  it('Can get post by username', async () => {
    const token = await authenticate()
    const getPostByUname = await request
      .get('/post/gopla')
      .set('authorization', `bearer ${token}`)
      .send()

      expect(getPostByUname.body).to.have.length(2)
  })

  it('Can update a post', async () => {
    const token = await authenticate()
    const updatePost = await request
      .put('/post/2')
      .set('authorization', `bearer ${token}`)
      .send({ post: 'keduax diupdate' })

    expect(updatePost.body).to.eql({
      isSuccess: true,
      message: 'Data updated',
    })
  })

  it('Can delete a post', async () => {
    const token = await authenticate()
    const updatePost = await request
      .delete('/post/2')
      .set('authorization', `bearer ${token}`)
      .send()

    expect(updatePost.body).to.eql({
      isSuccess: true,
      message: 'Data deleted',
    })
  })
})
