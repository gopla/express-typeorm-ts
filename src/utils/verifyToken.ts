require('dotenv').config()
import { Response, NextFunction } from 'express'
import { Request } from '../api/type'
import httpException from './httpException'
import jwt from 'jsonwebtoken'

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const bearerHeader = req.headers['authorization']
  const token = bearerHeader ? bearerHeader.split(' ')[1] : undefined
  if (token) {
    await jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) throw err
      req.user = payload
      next()
    })
  }
}
