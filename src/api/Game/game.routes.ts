import { Router } from 'express'
import * as controller from './game.controller'
import { validateRequest, AuthenticateAndAttach } from '../../middlewares'
import { CreateRoomDTO } from './game.dto'

const router = Router()

router.post(
  '/room/create',
  validateRequest({ body: CreateRoomDTO }),
  AuthenticateAndAttach,
  controller.createRoom,
)

export const gameRouter = router
