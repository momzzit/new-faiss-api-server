export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public code: string = 'INTERNAL_SERVER_ERROR'
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export class ValidationError extends ApiError {
    constructor(message: string) {
        super(message, 400, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string) {
        super(message, 404, 'NOT_FOUND');
        this.name = 'NotFoundError';
    }
}

export class ExternalApiError extends ApiError {
    constructor(message: string, public originalError?: Error) {
        super(message, 502, 'EXTERNAL_API_ERROR');
        this.name = 'ExternalApiError';
    }
}

export class DatabaseError extends ApiError {
    constructor(message: string, public originalError?: Error) {
        super(message, 503, 'DATABASE_ERROR');
        this.name = 'DatabaseError';
    }
} 