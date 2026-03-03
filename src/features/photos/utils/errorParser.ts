import { NetworkError, AuthError, NotFoundError, ClientError, ServerError, isNetworkErrorCode } from "../errors";

interface ProxyErrorResponse {
    error?: {
        type?: string;
        message?: string;
        code?: string;
    };
    message?: string;
}

export async function parseErrorResponse(res: Response): Promise<Error> {
    const statusCode = res.status;
    let errorData: ProxyErrorResponse;

    try {
        errorData = await res.json();
    } catch {
        const errorText = await res.text();
        errorData = { error: { message: errorText } };
    }

    const message = errorData?.error?.message || errorData?.message || res.statusText;
    const code = errorData?.error?.code;
    const type = errorData?.error?.type;

    // Handle structured proxy errors
    if (type === 'network' || isNetworkErrorCode(code)) {
        return new NetworkError(`Connection failed: ${message}`, code);
    }

    // Status code based errors
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