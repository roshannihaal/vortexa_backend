import { Router } from 'express'
import { certRouter } from './Cert'
import { authRouter } from './Auth'
import { flamesRouter } from './Flames'
import { gameRouter } from './Game'

const router = Router()

router.use('/cert', certRouter)

router.use('/auth', authRouter)

router.use('/flames', flamesRouter)

router.use('/game', gameRouter)

export const apiRouter = router
