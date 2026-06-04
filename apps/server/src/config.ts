export interface ServerConfig {
    PORT: number;
    IMMICH_URL: string;
    IMMICH_API_KEY: string;
    OWM_KEY?: string;
    /**
     * Absolute base URL the API is reachable at (e.g. https://slides.example.com).
     * When unset, absolute media URLs are derived per-request from the incoming
     * Host/X-Forwarded-* headers. Set this when clients (e.g. a native mobile app)
     * cannot rely on the request origin.
     */
    PUBLIC_BASE_URL?: string;
    /**
     * Public-facing URL of the Immich instance, used for `Photo.inAppUrl` deep-links.
     * Defaults to `IMMICH_URL`. Set this when your Immich server is reachable
     * externally at a different address than the internal `IMMICH_URL`
     * (e.g. https://immich.example.com vs http://192.168.1.10:2283).
     */
    IMMICH_PUBLIC_URL?: string;
    /**
     * Value for `Access-Control-Allow-Origin`. Defaults to `*` (any origin).
     * Set to a specific origin (e.g. `https://slides.example.com`) in production
     * when the API should not be callable from arbitrary browser origins.
     */
    CORS_ALLOWED_ORIGIN?: string;
}

/**
 * Load and validate server configuration from environment variables.
 * Expects env vars to be injected by the process runner (npm script, Docker, shell).
 */
export function loadConfig(): ServerConfig {
    const IMMICH_URL = process.env.IMMICH_URL;
    const IMMICH_API_KEY = process.env.IMMICH_API_KEY;
    const OWM_KEY = process.env.OWM_KEY;
    const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL;
    const IMMICH_PUBLIC_URL = process.env.IMMICH_PUBLIC_URL;
    const CORS_ALLOWED_ORIGIN = process.env.CORS_ALLOWED_ORIGIN;
    const portEnv = process.env.PORT;
    const PORT = portEnv ? parseInt(portEnv, 10) : 3000;
    if (Number.isNaN(PORT)) {
        console.error(`ERROR: PORT "${portEnv}" is not a valid number.`);
        process.exit(1);
    }

    // Validate required configuration
    if (!IMMICH_URL) {
        console.error('ERROR: IMMICH_URL is not set in environment variables!');
        process.exit(1);
    }

    if (!IMMICH_API_KEY) {
        console.error('ERROR: IMMICH_API_KEY is not set in environment variables!');
        process.exit(1);
    }

    // Log configuration (redact sensitive values)
    console.log('Configuration:');
    console.log('- PORT:', PORT);
    console.log('- IMMICH_URL:', IMMICH_URL);
    console.log('- IMMICH_API_KEY:', IMMICH_API_KEY ? '***set***' : 'NOT SET');
    console.log('- OWM_KEY:', OWM_KEY ? '***set***' : 'NOT SET');
    console.log('- PUBLIC_BASE_URL:', PUBLIC_BASE_URL || '(derived from request)');
    console.log('- IMMICH_PUBLIC_URL:', IMMICH_PUBLIC_URL || '(same as IMMICH_URL)');
    console.log('- CORS_ALLOWED_ORIGIN:', CORS_ALLOWED_ORIGIN || '*');

    return {
        PORT,
        IMMICH_URL,
        IMMICH_API_KEY,
        OWM_KEY,
        PUBLIC_BASE_URL,
        IMMICH_PUBLIC_URL,
        CORS_ALLOWED_ORIGIN,
    };
}
