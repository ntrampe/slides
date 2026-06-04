import type { ServerConfig } from '../config.js';
import {
    AuthError,
    ClientError,
    NetworkError,
    NotFoundError,
    ServerError,
    NETWORK_ERROR_CODES,
} from '@slides/shared/errors';

/** Timeout for upstream Immich requests (ms). Prevents hung slideshow requests. */
const REQUEST_TIMEOUT_MS = 30_000;

/**
 * Opaque asset proxy result returned by `fetchAsset`.
 * Routes are responsible for piping this to an Express response via `streamToResponse`.
 */
export interface AssetResponse {
    status: number;
    /** Headers to forward to the client (content-type, caching, range, etc.). */
    headers: Record<string, string>;
    /** WHATWG ReadableStream body, or null for empty responses. */
    body: ReadableStream<Uint8Array> | null;
}

/**
 * Low-level HTTP client for the Immich API.
 *
 * Responsibilities:
 * - Inject the server-side `x-api-key` (never exposed to clients)
 * - Map transport/HTTP failures onto the shared domain error types
 * - Fetch binary assets for proxying (callers handle the Express response)
 *
 * It deliberately knows nothing about domain models; mapping DTO -> domain
 * lives in the service layer.
 */
export class ImmichClient {
    private readonly _baseUrl: string;
    private readonly apiKey: string;

    constructor(config: ServerConfig) {
        this._baseUrl = config.IMMICH_URL.replace(/\/$/, '');
        this.apiKey = config.IMMICH_API_KEY;
    }

    /** The internal Immich base URL used for API calls. */
    get baseUrl(): string {
        return this._baseUrl;
    }

    async get<T>(path: string): Promise<T> {
        const res = await this.request(path, { method: 'GET' });
        return this.parseJson<T>(res);
    }

    async post<T>(path: string, body: unknown): Promise<T> {
        const res = await this.request(path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return this.parseJson<T>(res);
    }

    /**
     * Fetches an Immich binary asset (image/video) and returns an opaque
     * `AssetResponse` for the caller to pipe to a client. Forwards range
     * requests and relevant caching headers.
     *
     * Use `streamToResponse(result, res)` in the route layer to write to Express.
     */
    async fetchAsset(path: string, range?: string): Promise<AssetResponse> {
        const upstream = await this.request(path, {
            method: 'GET',
            headers: range ? { Range: range } : undefined,
        });

        if (!upstream.ok && upstream.status !== 206) {
            throw await this.mapError(upstream);
        }

        const headers: Record<string, string> = {};
        for (const header of [
            'content-type',
            'content-length',
            'content-range',
            'accept-ranges',
            'cache-control',
            'etag',
            'last-modified',
        ]) {
            const value = upstream.headers.get(header);
            if (value) headers[header] = value;
        }

        return {
            status: upstream.status,
            headers,
            body: upstream.body as ReadableStream<Uint8Array> | null,
        };
    }

    private async request(path: string, init: RequestInit): Promise<globalThis.Response> {
        const headers = new Headers(init.headers);
        headers.set('x-api-key', this.apiKey);

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
            return await fetch(`${this._baseUrl}${path}`, {
                ...init,
                headers,
                signal: controller.signal,
            });
        } catch (error) {
            const isTimeout = error instanceof Error && error.name === 'AbortError';
            const message = isTimeout
                ? `Immich request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`
                : error instanceof Error
                  ? error.message
                  : String(error);
            throw new NetworkError(message, NETWORK_ERROR_CODES.REFUSED);
        } finally {
            clearTimeout(timer);
        }
    }

    private async parseJson<T>(res: globalThis.Response): Promise<T> {
        if (!res.ok) throw await this.mapError(res);
        return (await res.json()) as T;
    }

    private async mapError(res: globalThis.Response): Promise<Error> {
        let message = res.statusText;
        try {
            const data = (await res.json()) as { message?: string; error?: string };
            message = data?.message || data?.error || message;
        } catch {
            // Non-JSON error body; keep the status text.
        }

        if (res.status === 401 || res.status === 403) {
            return new AuthError(`Authentication failed: ${message}`, res.status);
        }
        if (res.status === 404) {
            return new NotFoundError(`Not found: ${message}`);
        }
        if (res.status >= 400 && res.status < 500) {
            return new ClientError(`Request error: ${message}`, res.status);
        }
        return new ServerError(`Immich error: ${message}`, res.status);
    }
}
