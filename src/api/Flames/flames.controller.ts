import { Request, Response, NextFunction } from 'express'
import { CalculateFlamesDTO, FlamesHistoryDTO } from './flames.dto'
import {
  getFlamesResult,
  writeFlamesResult,
  getFlamesHistory,
} from './flames.service'

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

export const history = async (
  req: Request<unknown, unknown, unknown, FlamesHistoryDTO>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, query } = req
    const limit = Math.min(parseInt(query.limit || '50', 10), 50)

    const skip = query.skip ? parseInt(query.skip) : 0

    const history = await getFlamesHistory(user.id, limit, skip)

    const resStatusCode = 200
    res.status(resStatusCode).send({
      statusCode: resStatusCode,
      message: 'History',
      history,
    })
  } catch (error) {
    next(error)
  }
}
