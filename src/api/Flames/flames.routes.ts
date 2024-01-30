import { Router } from 'express'
import * as controller from './flames.controller'
import { validateRequest, AuthenticateAndAttach } from '../../middlewares'
import { CalculateFlamesDTO, FlamesHistoryDTO } from './flames.dto'

const router = Router()

router.post(
  '/',
  validateRequest({ body: CalculateFlamesDTO }),
  AuthenticateAndAttach,
  controller.calculate,
)

router.get(
  '/history',
  validateRequest({ query: FlamesHistoryDTO }),
  AuthenticateAndAttach,
  controller.history,
)

export const flamesRouter = router
