import { PrismaClient } from '@prisma/client'
import {
  CheckAndCreateUserResponseDTO,
  LoginDTO,
  SignupDTO,
  UserDTO,
} from './auth.dto'

const prisma = new PrismaClient()

export const checkAndCreateUser = async (
  userDetails: SignupDTO,
): Promise<CheckAndCreateUserResponseDTO> => {
  let created: boolean
  let message: string
  let newUser: UserDTO
  let response: CheckAndCreateUserResponseDTO
  try {
    const user = await prisma.user.findFirst({
      select: {
        email: true,
        username: true,
      },
      where: {
        OR: [
          {
            email: userDetails.email,
          },
          {
            username: userDetails.username,
          },
        ],
      },
    })

    if (!user) {
      newUser = await prisma.user.create({
        data: {
          username: userDetails.username,
          email: userDetails.email,
          name: userDetails.name,
          password: userDetails.password,
        },
      })
      created = true
      message = 'User created successfully'
      response = {
        created,
        message,
        user: newUser,
      }
    } else {
      created = false
      if (user.email === userDetails.email) {
        message = 'Email already exists'
      } else {
        message = 'Username already exists'
      }
      response = {
        created,
        message,
      }
    }

    return response
  } catch (error) {
    throw error
  }
}

export const checkAndReturnUser = async (
  userDetails: LoginDTO,
): Promise<UserDTO | null> => {
  try {
    const user = await prisma.user.findFirst({
      select: {
        email: true,
        username: true,
        id: true,
        name: true,
      },
      where: {
        OR: [
          {
            AND: [
              {
                username: userDetails.id,
              },
              {
                password: userDetails.password,
              },
            ],
          },
          {
            AND: [
              {
                email: userDetails.id,
              },
              {
                password: userDetails.password,
              },
            ],
          },
        ],
      },
    })
    return user
  } catch (error) {
    throw error
  }
}
