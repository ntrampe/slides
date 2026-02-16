import { Router } from 'express';
import { createProxyMiddleware, type Options } from 'http-proxy-middleware';
import type { ServerConfig } from '../config';

/**
 * Creates an Express router that proxies requests to Immich API
 * Path: /api/immich/* -> IMMICH_URL/*
 */
export function createImmichRouter(config: ServerConfig): Router {
    const router = Router();

    const proxyOptions: Options = {
        target: config.IMMICH_URL,
        changeOrigin: true,
        pathRewrite: {
            '^/api/immich': '', // /api/immich/api/assets -> /api/assets
        },
        on: {
            proxyReq: (proxyReq, req, _res) => {
                const originalPath = req.url || '';
                const targetPath = originalPath.replace('/api/immich', '');
                console.log(`[Immich] ${req.method} ${originalPath} -> ${config.IMMICH_URL}${targetPath}`);
                
                if (config.IMMICH_API_KEY) {
                    proxyReq.setHeader('x-api-key', config.IMMICH_API_KEY);
                }
            },
            proxyRes: (proxyRes, req, _res) => {
                console.log(`[Immich] Response: ${proxyRes.statusCode} for ${req.url || ''}`);
            },
            error: (err, req, _res) => {
                console.error(`[Immich] Error for ${req.url || ''}:`, err.message);
            },
        },
    };

    router.use('/', createProxyMiddleware(proxyOptions));

    return router;
}
