import express from 'express';
import { createProxyMiddleware, type Options } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const IMMICH_URL = process.env.IMMICH_URL;
const IMMICH_API_KEY = process.env.IMMICH_API_KEY;

// Validate configuration
if (!IMMICH_URL) {
    console.error('ERROR: IMMICH_URL is not set in environment variables!');
    process.exit(1);
}
if (!IMMICH_API_KEY) {
    console.warn('WARNING: IMMICH_API_KEY is not set - requests may fail');
}

console.log('Configuration:');
console.log('- IMMICH_URL:', IMMICH_URL);
console.log('- IMMICH_API_KEY:', IMMICH_API_KEY ? '***set***' : 'NOT SET');

// 1. The Immich Proxy
// This transforms /immich/... into IMMICH_URL/... 
// and injects the API Key automatically.
const proxyOptions: Options = {
    target: IMMICH_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/immich': '', // remove /immich from the URL before forwarding
    },
    on: {
        proxyReq: (proxyReq, req, _res) => {
            console.log(`[Proxy] ${req.method} ${req.url || ''} -> ${IMMICH_URL}${req.url ? req.url.replace('/immich', '') : ''}`);
            if (IMMICH_API_KEY) {
                proxyReq.setHeader('x-api-key', IMMICH_API_KEY);
            }
        },
        proxyRes: (proxyRes, req, _res) => {
            console.log(`[Proxy] Response: ${proxyRes.statusCode} for ${req.url || ''}`);
        },
        error: (err, req, _res) => {
            console.error(`[Proxy] Error for ${req.url || ''}:`, err.message);
        },
    },
};

app.use('/immich', createProxyMiddleware(proxyOptions));

// 2. Serve the React Production Build
// __dirname is src/server, so we need to go up two levels to reach project root
const buildPath = path.join(__dirname, '../../dist');
app.use(express.static(buildPath));

// Catch-all route for SPA (Express 5 compatible)
app.use((_req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n=================================`);
    console.log(`BFF Server running on http://localhost:${PORT}`);
    console.log(`Proxying /immich/* to ${IMMICH_URL}`);
    console.log(`=================================\n`);
});