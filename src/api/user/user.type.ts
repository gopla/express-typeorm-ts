export interface IUser {
  name: string
  username: string
  password: string
}

export interface IUserRegisterRequest {
  name: string
  username: string
  password: string
}

export interface IUserLoginRequest {
  username: string
  password: string
}
