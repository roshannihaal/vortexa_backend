import { prismaClient } from '../../utils/PrismaClient'
import {
  CheckAndCreateUserResponseDTO,
  CheckAndReturnUserResponseDTO,
  LoginDTO,
  SignupDTO,
} from './auth.dto'
import bcrypt from 'bcrypt'
import { config } from '../../config'

export const checkAndCreateUser = async (
  userDetails: SignupDTO,
): Promise<CheckAndCreateUserResponseDTO> => {
  try {
    let body: CheckAndCreateUserResponseDTO = {
      created: false,
      message: '',
    }

    const existingUser = await prismaClient.user.findFirst({
      select: {
        email: true,
        username: true,
      },
      where: {
        OR: [{ email: userDetails.email }, { username: userDetails.username }],
      },
    })

    if (!existingUser) {
      const hashedPassword = hashPassword(userDetails.password)

      const newUser = await prismaClient.user.create({
        data: {
          username: userDetails.username,
          email: userDetails.email,
          name: userDetails.name,
          password: hashedPassword,
        },
      })

      body = {
        created: true,
        message: 'User created successfully',
        user: newUser,
      }
    } else {
      if (existingUser.email === userDetails.email) {
        body.message = 'Email already exists'
      } else {
        body.message = 'Username already exists'
      }
    }

    const response = CheckAndCreateUserResponseDTO.parse(body)

    return response
  } catch (error) {
    throw error
  }
}

export const checkAndReturnUser = async (
  userDetails: LoginDTO,
): Promise<CheckAndReturnUserResponseDTO> => {
  try {
    const user = await prismaClient.user.findFirst({
      select: {
        email: true,
        username: true,
        id: true,
        name: true,
        password: true,
      },
      where: {
        OR: [
          {
            username: userDetails.id,
          },
          {
            email: userDetails.id,
          },
        ],
      },
    })

    let message: string
    let authenticated: boolean
    let accountExists: boolean

    if (user) {
      const isCredentialsCorrect = validatePassword(
        userDetails.password,
        user.password,
      )

      message = isCredentialsCorrect
        ? 'Login successful'
        : 'Invalid credentials'
      authenticated = isCredentialsCorrect
      accountExists = true
    } else {
      message = 'Account does not exist'
      authenticated = false
      accountExists = false
    }

    const body = {
      message,
      authenticated,
      accountExists,
      user: user || undefined,
    }

    const response = CheckAndReturnUserResponseDTO.parse(body)

    return response
  } catch (error) {
    throw error
  }
}

const hashPassword = (password: string): string => {
  const hashRounds = config.HASH_ROUNDS
  const result = bcrypt.hashSync(password, hashRounds)
  return result
}

const validatePassword = (
  password: string,
  hashedPassword: string,
): boolean => {
  const result = bcrypt.compareSync(password, hashedPassword)
  return result
}
