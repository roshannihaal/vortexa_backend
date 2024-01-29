import { Request, Response, NextFunction } from 'express'
import { LoginDTO, SignupDTO } from './auth.dto'
import {
  generateJwtToken,
  addNewSession,
  isMaxSessionsReached,
  removeOldestSession,
} from '../../utils'
import { checkAndCreateUser, checkAndReturnUser } from './auth.service'

export const signUp = async (
  req: Request<unknown, unknown, SignupDTO>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { body } = req

    // Password validation
    if (body.password !== body.confirmPassword) {
      res.status(400)
      throw new Error('Passwords do not match')
    }

    // Checks if the username or emailid is already taken and creates a new user
    const response = await checkAndCreateUser(body)
    if (!response.created) {
      res.status(403)
      throw new Error(response.message)
    }

    const { user } = response

    // Generates the token
    let token, sessionId
    if (user) {
      ;({ token, sessionId } = generateJwtToken(user.id))
      await addNewSession(user.id, sessionId, token)
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
    const { body, query } = req

    // Checks if the provided credentials are correct
    const response = await checkAndReturnUser(body)
    if (!response.authenticated) {
      if (response.accountExists) {
        res.status(401)
      } else {
        res.status(404)
      }
      throw new Error(response.message)
    }

    const { user } = response

    let token, sessionId
    if (user) {
      const isMaxSessionReached = await isMaxSessionsReached(user.id)
      if (isMaxSessionReached) {
        if (query.force) {
          await removeOldestSession(user.id)
        } else {
          res.status(401)
          throw new Error('Max sessions reached')
        }
      }
      ;({ token, sessionId } = generateJwtToken(user.id))
      await addNewSession(user.id, sessionId, token)
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
