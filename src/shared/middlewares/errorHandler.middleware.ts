import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../errors/BaseError';

function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof BaseError) {
        return res.status(err.statusCode).json({
            status: 'error',
            resultadoTriagem: '2',
            message: err.message,
        });
    }

    console.error(err);
    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
}

export default errorHandler;