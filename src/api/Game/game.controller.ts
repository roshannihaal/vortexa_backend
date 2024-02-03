import { Request, Response, NextFunction } from 'express'
import { CreateRoomDTO } from './game.dto'

import { createRoomService } from './game.service'
import { config } from '../../config'

export const createRoom = async (
  req: Request<unknown, unknown, CreateRoomDTO>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { game } = req.body
    let roomPrefix: string

    switch (game) {
      case 'tictactoe':
        roomPrefix = config.TICTACTOE_PREFIX
        break
      default:
        roomPrefix = 'X'
    }
    const room = await createRoomService(roomPrefix)
    const resStatusCode = 200

    res
      .status(resStatusCode)
      .json({ statusCode: resStatusCode, message: 'Room created!', room })
  } catch (error) {
    next(error)
  }
}
