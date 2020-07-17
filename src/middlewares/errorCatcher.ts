import { Request, Response, NextFunction } from 'express';
import AppError from '../error/AppError';

export default function errorCatcher(
    err: Error,
    request: Request,
    response: Response,
    next: NextFunction,
): Response {
    // if error already defined by me,
    // return defined message
    if (err instanceof AppError) {
        return response
            .status(err.statusCode)
            .json({ status: 'error', message: err.message });
    }

    console.log(err);
    // unexpected error
    return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
}
