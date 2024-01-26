import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const HTTP_SERVER_ERROR = 500

  if (error instanceof ZodError) {
    return res.status(422).send({
      statusCode: 422,
      message: error.issues.map((issue) => issue.message).join(', '),
    })
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : HTTP_SERVER_ERROR

  const errorResponse = {
    statusCode: statusCode,
    message: error.message,
  }

  return res.status(statusCode).send(errorResponse)
}
