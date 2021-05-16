import { RequestHandler, Request, Response } from 'express';
import logger from '../../../logger';
import { AuthService } from '../services/auth-services';

const authService = new AuthService();

export const register: RequestHandler = async (req: Request, res: Response, next) => {
  logger.info('--------------Register new user--------------')
  logger.debug(req.body);
  authService.register(req.body)
    .then(result => res.send(result))
    .catch(error => next(error.message));
};

export default register;
