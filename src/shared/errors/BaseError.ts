export class BaseError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number = 400) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends BaseError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class NotFoundError extends BaseError {
    constructor(message: string) {
        super(message, 404);
    }
}