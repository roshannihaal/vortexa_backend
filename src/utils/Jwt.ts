import jwt, { JwtPayload } from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { config } from '../config'
import { GenerateJwtTokenResponse } from './utils.dto'

const getNewSession = () => {
  const sessionId = randomUUID()
  return sessionId
}

export const generateJwtToken = (userId: string): GenerateJwtTokenResponse => {
  const sessionId = getNewSession()
  const jwtSecret = config.JWT_SECRET
  const jwtExpiresIn = config.JWT_EXPIRES_IN
  const data = {
    userId,
    sessionId,
  }
  const token = jwt.sign(data, jwtSecret, { expiresIn: jwtExpiresIn })

  const response = { token, sessionId }

  return response
}

export const getJwtExpiry = (token: string) => {
  const decodedToken = jwt.decode(token) as JwtPayload
  const exp = decodedToken.exp
  return exp
}

export const verifyJwtToken = (token: string): JwtPayload => {
  try {
    const jwtSecret = config.JWT_SECRET
    const decodedToken = jwt.verify(token, jwtSecret) as JwtPayload
    return decodedToken
  } catch (error) {
    throw Error('Please authenticate')
  }
}
