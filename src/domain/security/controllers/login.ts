import { RequestHandler, Request, Response } from 'express';
import { AuthService } from '../services/auth-services';

const authService = new AuthService();

export const login: RequestHandler = async (req: Request, res: Response, next) => {
  console.log('--------------------------login--------------------------')
  authService.login(req.body['userName'], req.body['password'])
    .then(result => res.send(result))
    .catch(error => next(error.message));
};