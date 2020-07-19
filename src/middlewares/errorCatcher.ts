import { Request, Response, NextFunction } from 'express';
import AppError from '../error/AppError';

export default function errorCatcher(
    err: Error,
    request: Request,
    response: Response,
    next: NextFunction,
): Response {
    console.log(err);
    console.log(response);
    console.log(request);
    // return defined message if error was already defined by me
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    console.error(err);

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
}
