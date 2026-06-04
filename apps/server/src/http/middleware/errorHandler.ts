import type { NextFunction, Request, Response } from 'express';
import { ApiError, isNetworkErrorCode } from '@slides/shared/errors';
import type { ApiErrorEnvelope } from '@slides/api-contract';

/**
 * Central error -> HTTP translator for the API. Maps the shared domain error
 * types onto a consistent JSON envelope that the client error parser
 * understands.
 */
export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    next: NextFunction
): void {
    if (res.headersSent) {
        next(err);
        return;
    }

    if (err instanceof ApiError) {
        const status = err.statusCode ?? 500;
        res.status(status).json(buildBody(err.code, status, err.message));
        return;
    }

    const message = err instanceof Error ? err.message : 'Unexpected server error';
    console.error('[API] Unhandled error:', message);
    res.status(500).json({ error: { type: 'server', message } } satisfies ApiErrorEnvelope);
}

function buildBody(code: string, status: number, message: string): ApiErrorEnvelope {
    let type: ApiErrorEnvelope['error']['type'] = 'server';
    if (code === 'NETWORK_ERROR' || isNetworkErrorCode(code)) {
        type = 'network';
    } else if (code === 'AUTH_ERROR' || status === 401 || status === 403) {
        type = 'auth';
    } else if (status >= 400 && status < 500) {
        type = 'client';
    }
    return { error: { type, message, code } };
}
