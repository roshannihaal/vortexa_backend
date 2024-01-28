import { Router } from 'express'
import * as controller from './auth.controller'
import { validateRequest } from '../../middlewares'
import { LoginDTO, SignupDTO } from './auth.dto'

const router = Router()

router.post('/signup', validateRequest({ body: SignupDTO }), controller.signUp)

router.post('/login', validateRequest({ body: LoginDTO }), controller.logIn)

export const authRouter = router