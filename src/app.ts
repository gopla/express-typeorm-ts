import express, { Application, NextFunction, Request, Response } from 'express'
import userRouter from './api/user/user.router'
import postRouter from './api/post/post.router'

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

export default app
