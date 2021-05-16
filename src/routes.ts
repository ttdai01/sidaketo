import { Router } from 'express';
import * as AuthController from './domain/security/controllers'
import AuthMiddleware from './domain/security/auth-middleware';
import { greetings } from './domain/greetings/greetings'

const router = Router();

const authorizeRouter = Router();

authorizeRouter.use(AuthMiddleware.validateToken);

router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);
router.get('/', (req,res)=>{
    res.send('Hello Sunshine <3')
})

router.use(authorizeRouter);

export default router;