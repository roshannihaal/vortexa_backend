import { Request, Response, NextFunction } from 'express'
import { getPublicKey } from '../../utils'

export const getCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const publicKey = getPublicKey()
  const resStatusCode = 200
  res
    .status(resStatusCode)
    .send({ statusCode: resStatusCode, message: 'Public Key', publicKey })
  try {
  } catch (error) {
    console.error(`Error getting public key: ${error}`)
  }
}
