import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { getCustomRepository } from "typeorm"
import { UserRepositories } from "../repositories/UserRepositories"

interface IAuthenticateRequest {
  email: string;
  password: string;
}

class AuthenticateUserService {
  async execute({email, password}: IAuthenticateRequest) {
    const userRepositories = getCustomRepository(UserRepositories)
    const user = await userRepositories.findOne({ email })

    if (!user) {
      throw new Error("Email/Password incorrect")
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new Error("Email/Password incorrect")
    }

  const token = sign(
    { email: user.email },
    "d11e1d8658150f5799bd9b5547d8425b",
    { 
      subject: user.id,
      expiresIn: "1d"
    }
  )

  return token
  }
}

export { AuthenticateUserService }