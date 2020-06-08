import { IUser, IUserLoginRequest, IUserRegisterRequest } from './user.type'
import { getRepository } from 'typeorm'
import { User } from './user.entity'
import userUtils from './user.utils'
import httpException from '../../utils/httpException'
import jwt from 'jsonwebtoken'

export default class UserService {
  getUsername = (username: string) => {
    return getRepository(User).find({ where: { username: username } })
  }

  createUser = (user: IUserRegisterRequest) => {
    return new Promise<User>(async (resolve, reject) => {
      try {
        const userExist = await this.getUsername(user.username)
        if (userExist[0]) throw new httpException(301, 'Username already exist')

        const hashedPass = await userUtils.hash(user.password)

        const userDocument = await getRepository(User).save({
          name: user.name,
          username: user.username,
          password: hashedPass,
        })
        resolve(userDocument)
      } catch (error) {
        reject(error)
      }
    })
  }

  authenticateUser = (user: IUserLoginRequest) => {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const userDocument = await this.getUsername(user.username)
        if (!userDocument[0]) throw new httpException(404, 'Username not found')
        const isPassMatch = await userUtils.compare(
          user.password,
          userDocument[0].password
        )
        if (!isPassMatch) throw new httpException(302, 'Wrong password')
        const token = jwt.sign(
          {
            id: userDocument[0].id,
            name: userDocument[0].name,
            username: userDocument[0].username,
          },
          process.env.JWT_SECRET || ''
        )
        resolve(token)
      } catch (error) {
        reject(error)
      }
    })
  }
}
