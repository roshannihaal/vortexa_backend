import { Request, Response, NextFunction } from 'express'
import { getPublicKey } from '../../utils'

export const getCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const publicKey = getPublicKey()
    const resStatusCode = 200
    res
      .status(resStatusCode)
      .send({ statusCode: resStatusCode, message: 'Public Key', publicKey })
  } catch (error) {
    next(error)
  }
}
