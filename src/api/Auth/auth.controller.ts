import { Request, Response, NextFunction } from 'express'
import { LoginDTO, SignupDTO } from './auth.dto'
import {
  generateJwtToken,
  addNewSession,
  isMaxSessionsReached,
} from '../../utils'
import { checkAndCreateUser, checkAndReturnUser } from './auth.service'

export const signUp = async (
  req: Request<unknown, unknown, SignupDTO>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body

    // Password validation
    if (data.password !== data.confirmPassword) {
      res.status(400)
      throw new Error('Passwords do not match')
    }

    // Checks if the username or emailid is already taken and creates a new user
    const response = await checkAndCreateUser(data)
    if (!response.created) {
      res.status(403)
      throw new Error(response.message)
    }

    // Generates the token
    let token, sessionId
    if (response.user) {
      ;({ token, sessionId } = generateJwtToken(response.user.id))
      await addNewSession(response.user.id, sessionId, token)
    }

    const resStatusCode = 200
    res.status(resStatusCode).send({
      statusCode: resStatusCode,
      message: response.message,
      token,
    })
  } catch (error) {
    next(error)
  }
}

export const logIn = async (
  req: Request<unknown, unknown, LoginDTO>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body

    // Checks if the provided credentials are correct
    const response = await checkAndReturnUser(data)
    if (!response.authenticated) {
      if (response.accountExists) {
        res.status(401)
      } else {
        res.status(404)
      }
      throw new Error(response.message)
    }

    let token, sessionId
    if (response.user) {
      const isMaxSessionReached = await isMaxSessionsReached(response.user.id)
      if (isMaxSessionReached) {
        res.status(401)
        throw new Error('Max sessions reached')
      }
      ;({ token, sessionId } = generateJwtToken(response.user.id))
      await addNewSession(response.user.id, sessionId, token)
    }

    const resStatusCode = 200
    res.status(resStatusCode).send({
      statusCode: resStatusCode,
      message: 'Successfully logged in',
      token,
      user: response.user,
    })
  } catch (error) {
    next(error)
  }
}
