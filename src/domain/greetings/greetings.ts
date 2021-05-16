import { RequestHandler, Request, Response } from 'express';

export const greetings: RequestHandler = async (req: Request, res: Response, next) => {
    console.log('--------------------------greetings--------------------------')
    res.send('hello');
};