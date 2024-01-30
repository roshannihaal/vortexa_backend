import { Request, Response, NextFunction } from 'express'
import { CalculateFlamesDTO } from './flames.dto'
import { getFlamesResult, writeFlamesResult } from './flames.service'

export const calculate = async (
  req: Request<unknown, unknown, CalculateFlamesDTO>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { body } = req

    const { user } = req

    const result = getFlamesResult(body.name1, body.name2)

    await writeFlamesResult(user.id, body.name1, body.name2, result)

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
