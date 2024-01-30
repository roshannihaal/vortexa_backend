import { Request, Response, NextFunction } from 'express'
import { verifyJwtToken, prismaClient } from '../utils'

const TOKEN_NAME = 'X-TOKEN'

export const AuthenticateAndAttach = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header(TOKEN_NAME)
    if (token) {
      const decodedToken = verifyJwtToken(token)

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
    } else {
      throw Error('Please Authenticate')
    }
  } catch (error) {
    res.status(401)
    next(error)
  }
}
