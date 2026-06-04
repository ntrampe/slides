import type { Request } from 'express';
import type { ServerConfig } from '../../config.js';

/**
 * Resolves the absolute base URL that clients should use to reach this API.
 *
 * Prefers the configured PUBLIC_BASE_URL (useful for native/mobile clients that
 * cannot rely on the request origin), otherwise derives it from the incoming
 * request, honouring reverse-proxy forwarding headers.
 */
export function resolveBaseUrl(req: Request, config: ServerConfig): string {
    if (config.PUBLIC_BASE_URL) {
        return config.PUBLIC_BASE_URL.replace(/\/$/, '');
    }

    const forwardedProto = firstHeaderValue(req.headers['x-forwarded-proto']);
    const forwardedHost = firstHeaderValue(req.headers['x-forwarded-host']);

    const protocol = forwardedProto ?? req.protocol;
    const host = forwardedHost ?? req.get('host') ?? `localhost:${config.PORT}`;

    return `${protocol}://${host}`;
}

function firstHeaderValue(value: string | string[] | undefined): string | undefined {
    if (!value) return undefined;
    const raw = Array.isArray(value) ? value[0] : value;
    return raw.split(',')[0]?.trim() || undefined;
}
