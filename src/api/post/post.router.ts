import { Router } from 'express'
import PostController from './post.controller'
import { verifyToken } from '../../utils/verifyToken'

const postRouter = Router()
const postController = new PostController()
const baseUrl = `/post`

postRouter.use(verifyToken)

postRouter.get(`${baseUrl}`, postController.index)
postRouter.get(`${baseUrl}/:username`, postController.show)
postRouter.post(`${baseUrl}`, postController.store)
postRouter.put(`${baseUrl}/:id`, postController.update)
postRouter.delete(`${baseUrl}/:id`, postController.delete)

export default postRouter
