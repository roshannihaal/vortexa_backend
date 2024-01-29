import { Router } from 'express'
import * as controller from './cert.controller'

const router = Router()

router.get('/', controller.getCertificate)

export const certRouter = router
