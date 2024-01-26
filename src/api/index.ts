import { Router } from 'express'

import { certRouter } from './Cert'

const router = Router()

router.use('/cert', certRouter)

export const apiRouter = router
