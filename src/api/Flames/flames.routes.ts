import { Router } from 'express'
import * as controller from './flames.controller'
import { validateRequest } from '../../middlewares'
import { CalculateFlamesDTO } from './flames.dto'

const router = Router()

router.post(
  '/',
  validateRequest({ body: CalculateFlamesDTO }),
  controller.calculate,
)

export const flamesRouter = router
