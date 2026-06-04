import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Wraps an async route handler so rejected promises are forwarded to the
 * Express error middleware instead of crashing or hanging the request.
 */
export function asyncHandler(
    handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
    return (req, res, next) => {
        handler(req, res, next).catch(next);
    };
}

/** Extracts the raw query string (including the leading `?`) from a request. */
export function queryString(req: Request): string {
    const index = req.url.indexOf('?');
    return index >= 0 ? req.url.substring(index) : '';
}
