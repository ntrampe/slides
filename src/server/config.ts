import dotenv from 'dotenv';

dotenv.config();

export interface ServerConfig {
    PORT: number;
    IMMICH_URL: string;
    IMMICH_API_KEY: string;
    OWM_KEY?: string;
}

/**
 * Load and validate server configuration from environment variables
 */
export function loadConfig(): ServerConfig {
    const IMMICH_URL = process.env.IMMICH_URL;
    const IMMICH_API_KEY = process.env.IMMICH_API_KEY;
    const OWM_KEY = process.env.OWM_KEY;
    const PORT = parseInt(process.env.PORT || '3000', 10);

    // Validate required configuration
    if (!IMMICH_URL) {
        console.error('ERROR: IMMICH_URL is not set in environment variables!');
        process.exit(1);
    }

    if (!IMMICH_API_KEY) {
        console.warn('WARNING: IMMICH_API_KEY is not set in environment variables!');
        process.exit(1);
    }

    // Log configuration (redact sensitive values)
    console.log('Configuration:');
    console.log('- PORT:', PORT);
    console.log('- IMMICH_URL:', IMMICH_URL);
    console.log('- IMMICH_API_KEY:', IMMICH_API_KEY ? '***set***' : 'NOT SET');
    console.log('- OWM_KEY:', OWM_KEY ? '***set***' : 'NOT SET');

    return {
        PORT,
        IMMICH_URL,
        IMMICH_API_KEY,
        OWM_KEY,
    };
}
