/** Base class for typed API/upstream errors mapped to HTTP by the server. */
export abstract class ApiError extends Error {
    abstract readonly code: string;
    readonly statusCode?: number;

    constructor(message: string, statusCode?: number) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class NetworkError extends ApiError {
    readonly code = 'NETWORK_ERROR';
    readonly originalError?: string;

    constructor(message: string, originalError?: string) {
        super(message, 503);
        this.originalError = originalError;
    }
}

export class AuthError extends ApiError {
    readonly code = 'AUTH_ERROR';

    constructor(message: string, statusCode = 401) {
        super(message, statusCode);
    }
}

export class NotFoundError extends ApiError {
    readonly code = 'NOT_FOUND';

    constructor(message: string) {
        super(message, 404);
    }
}

export class ClientError extends ApiError {
    readonly code = 'CLIENT_ERROR';

    constructor(message: string, statusCode: number) {
        super(message, statusCode);
    }
}

export class ServerError extends ApiError {
    readonly code = 'SERVER_ERROR';

    constructor(message: string, statusCode: number) {
        super(message, statusCode);
    }
}

export const NETWORK_ERROR_CODES = {
    UNREACHABLE: 'ENETUNREACH',
    REFUSED: 'ECONNREFUSED',
    TIMEOUT: 'ETIMEDOUT',
    ABORT: 'ECONNABORTED',
} as const;

export type NetworkErrorCode = (typeof NETWORK_ERROR_CODES)[keyof typeof NETWORK_ERROR_CODES];

export function isNetworkErrorCode(code?: string): code is NetworkErrorCode {
    return code ? Object.values(NETWORK_ERROR_CODES).includes(code as NetworkErrorCode) : false;
}
