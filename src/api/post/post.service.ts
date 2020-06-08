import { IPost, IRequestNewPost } from './post.type'
import { Post } from './post.entity'
import { getRepository } from 'typeorm'

export default class PostService {
  getAllPost = () => {
    return getRepository(Post).find()
  }

  getPostByUsername = (username: string) => {
    return new Promise(async (resolve, reject) => {
      console.log(username)

      try {
        const postDoc = await getRepository(Post).find({
          where: {
            user: {
              username: username,
            },
          },
        })

        resolve(postDoc)
      } catch (error) {
        reject(error)
      }
    })
  }

  createPost = (userId: number, post: IRequestNewPost) => {
    return new Promise<Post>(async (resolve, reject) => {
      try {
        const postDoc = await getRepository(Post).save({
          userId: userId,
          post: post.post,
        })
        resolve(postDoc)
      } catch (error) {
        reject(error)
      }
    })
  }

  updatePost = (postId: string, post: IRequestNewPost) => {
    return new Promise(async (resolve, reject) => {
      try {
        const postDoc = await getRepository(Post).update(postId, {
          post: post.post,
        })
        resolve(postDoc)
      } catch (error) {
        reject(error)
      }
    })
  }

  deletePost = (postId: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const postDoc = await getRepository(Post).delete(postId)
        resolve(postDoc)
      } catch (error) {
        reject(error)
      }
    })
  }
}
