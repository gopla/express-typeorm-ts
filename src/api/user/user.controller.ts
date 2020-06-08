import { Request, Response, NextFunction } from 'express'
import UserService from './user.service'
import httpException from '../../utils/httpException'

const userService = new UserService()

export default class UserController {
  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, username, password } = req.body
      const user = await userService.createUser({ name, username, password })
      res.json(user)
    } catch (error) {
      next(new httpException(error.statusCode, error.message))
    }
  }

  authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body
      const token = await userService.authenticateUser({ username, password })
      res.json({ isSuccess: true, token: token })
    } catch (error) {
      next(new httpException(error.statusCode, error.message))
    }
  }
}
