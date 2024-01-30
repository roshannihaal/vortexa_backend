import { Request, Response, NextFunction } from 'express'
import { verifyJwtToken, prismaClient } from '../utils'
import { getCurrentSession } from '../utils'

const TOKEN_NAME = 'X-TOKEN'

export const AuthenticateAndAttach = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Check token, throw error if not found
    const token = req.header(TOKEN_NAME)
    if (!token) {
      throw Error('Please Authenticate')
    }

    const decodedToken = verifyJwtToken(token)

    // Get current session from redis, throw error if not found
    const currentSession = getCurrentSession(
      decodedToken.userId,
      decodedToken.sessionId,
    )
    if (!currentSession) {
      throw Error('Please Authenticate')
    }

    // Find user in db, throw error if not found
    const { userId } = decodedToken
    const user = await prismaClient.user.findFirst({
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
      },
      where: {
        id: userId,
      },
    })
    if (!user) {
      throw Error('Please Authenticate')
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401)
    next(error)
  }
}
