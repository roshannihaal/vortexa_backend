import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { config } from '../config'

export const generateJwtToken = (userId: string) => {
  const sessionId = randomUUID()
  const jwtSecret = config.JWT_SECRET
  const jwtExpiresIn = config.JWT_EXPIRES_IN
  const data = {
    userId,
    sessionId,
  }
  const token = jwt.sign(data, jwtSecret, { expiresIn: jwtExpiresIn })
  return token
}
