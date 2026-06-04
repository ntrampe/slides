import {
    AuthError,
    ClientError,
    NetworkError,
    NotFoundError,
    ServerError,
    isNetworkErrorCode,
} from '@slides/shared/errors';
import type { ApiErrorEnvelope } from '@slides/api-contract';

export const API_BASE = '/api/v1';

export async function parseErrorResponse(res: Response): Promise<Error> {
    const statusCode = res.status;
    let errorData: ApiErrorEnvelope & { message?: string };

    try {
        errorData = await res.json();
    } catch {
        const errorText = await res.text().catch(() => '');
        errorData = { error: { message: errorText } };
    }

    const message = errorData?.error?.message || errorData?.message || res.statusText;
    const code = errorData?.error?.code;
    const type = errorData?.error?.type;

    if (type === 'network' || isNetworkErrorCode(code)) {
        return new NetworkError(`Connection failed: ${message}`, code);
    }
    if (statusCode === 401 || statusCode === 403) {
        return new AuthError(`Authentication failed: ${message}`, statusCode);
    }
    if (statusCode === 404) {
        return new NotFoundError(`Not found: ${message}`);
    }
    if (statusCode >= 400 && statusCode < 500) {
        return new ClientError(`Request error: ${message}`, statusCode);
    }
    if (statusCode >= 500) {
        return new ServerError(`Server error: ${message}`, statusCode);
    }
    return new ServerError(`Request failed: ${message}`, statusCode);
}

export async function apiGet<T>(path: string): Promise<T> {
    let res: Response;
    try {
        res = await fetch(`${API_BASE}${path}`);
    } catch {
        throw new NetworkError(
            'Unable to connect to the server. Check your network connection.',
            'ECONNREFUSED'
        );
    }
    if (!res.ok) throw await parseErrorResponse(res);
    return (await res.json()) as T;
}

export async function apiPut<T>(path: string, body: unknown): Promise<T | undefined> {
    let res: Response;
    try {
        res = await fetch(`${API_BASE}${path}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
    } catch {
        throw new NetworkError(
            'Unable to connect to the server. Check your network connection.',
            'ECONNREFUSED'
        );
    }
    if (!res.ok) throw await parseErrorResponse(res);
    if (res.status === 204) return undefined;
    return (await res.json()) as T;
}

export async function apiDelete(path: string): Promise<void> {
    let res: Response;
    try {
        res = await fetch(`${API_BASE}${path}`, { method: 'DELETE' });
    } catch {
        throw new NetworkError(
            'Unable to connect to the server. Check your network connection.',
            'ECONNREFUSED'
        );
    }
    if (!res.ok) throw await parseErrorResponse(res);
}
