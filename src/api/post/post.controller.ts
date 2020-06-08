import { Response, NextFunction } from 'express'
import { Request } from '../type'
import PostService from './post.service'
import httpException from '../../utils/httpException'

const postService = new PostService()

export default class PostController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postRes = await postService.getAllPost()
      res.json(postRes)
    } catch (error) {
      next(new httpException(error.statusCode, error.message))
    }
  }

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postRes = await postService.getPostByUsername(req.params.username)

      res.json(postRes)
    } catch (error) {
      next(new httpException(error.statusCode, error.message))
    }
  }

  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postRes = await postService.createPost(req.user.id, req.body)
      res.json(postRes)
    } catch (error) {
      next(new httpException(error.statusCode, error.message))
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await postService.updatePost(req.params.id, req.body)
      res.json({ isSuccess: true, message: 'Data updated' })
    } catch (error) {
      next(new httpException(error.statusCode, error.message))
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await postService.deletePost(req.params.id)
      res.json({ isSuccess: true, message: 'Data deleted' })
    } catch (error) {
      next(new httpException(error.statusCode, error.message))
    }
  }
}
