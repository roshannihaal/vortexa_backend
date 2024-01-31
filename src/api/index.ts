import { Router } from 'express'
import { certRouter } from './Cert'
import { authRouter } from './Auth'
import { flamesRouter } from './Flames'

const router = Router()

router.use('/cert', certRouter)

router.use('/auth', authRouter)

router.use('/flames', flamesRouter)

export const apiRouter = router
