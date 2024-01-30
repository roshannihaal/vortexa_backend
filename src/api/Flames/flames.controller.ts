import { Request, Response, NextFunction } from 'express'
import { CalculateFlamesDTO } from './flames.dto'
import { getFlamesResult } from './flames.service'

export const calculate = async (
  req: Request<unknown, unknown, CalculateFlamesDTO>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { body } = req

    const result = getFlamesResult(body.name1, body.name2)

    const resStatusCode = 200
    res.status(resStatusCode).send({
      statusCode: resStatusCode,
      message: 'Calculated',
      result,
    })
  } catch (error) {
    next(error)
  }
}
