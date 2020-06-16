import express, { Application, NextFunction, Request, Response } from 'express'
import userRouter from './api/user/user.router'
import postRouter from './api/post/post.router'
import errorHandler from './middlewares/errorHandler'

const app: Application = express()

app.use(express.json())

app.get(`/`, (req: Request, res: Response) => {
  res.json({
    isSucces: true,
    message: 'Hello, World!',
  })
})

app.use(userRouter)
app.use(postRouter)
app.use(errorHandler)

export default app
