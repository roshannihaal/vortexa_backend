import { Router } from 'express'
import { certRouter } from './Cert'
import { authRouter } from './Auth'

const router = Router()

router.use('/cert', certRouter)

router.use('/auth', authRouter)

export const apiRouter = router
