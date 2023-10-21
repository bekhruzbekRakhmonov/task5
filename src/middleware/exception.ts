import { NextFunction, Response, Request } from 'express'
import HttpException from '../exceptions/http-exception'

export function exceptionFilter(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (err instanceof HttpException) {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        })
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        })
    }
}

export default exceptionFilter
