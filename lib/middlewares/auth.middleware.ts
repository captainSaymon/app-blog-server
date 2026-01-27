import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import jwt from 'jsonwebtoken';

export const auth = (request: Request, response: Response, next: NextFunction) => {
    const token = request.header('x-auth-token')?.replace('Bearer ', '');

    if (!token) {
        return response.status(401).send('Brak tokena, autoryzacja odrzucona.');
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        (request as any).user = decoded;
        next();
    } catch (err) {
        response.status(401).send('Token jest nieprawidłowy.');
    }
};