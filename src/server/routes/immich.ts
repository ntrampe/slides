import { Router, type Response } from 'express';
import { createProxyMiddleware, type Options } from 'http-proxy-middleware';
import type { ServerConfig } from '../config';
import { isNetworkErrorCode } from '../../shared/errors/photos';

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
            error: (err, req, res) => {
                console.error(`[Immich] Error for ${req.url || ''}:`, err.message);
                handleProxyError(err, res as Response);
            },
        },
    };

    router.use('/', createProxyMiddleware(proxyOptions));

    return router;
}

function handleProxyError(err: Error, res: Response): void {
    if (res.headersSent) return;

    const nodeError = err as NodeJS.ErrnoException;
    const isNetworkError = isNetworkErrorCode(nodeError.code);

    res.status(isNetworkError ? 503 : 502).json({
        error: {
            type: isNetworkError ? 'network' : 'server',
            message: `Unable to connect to Immich: ${err.message}`,
            code: nodeError.code,
        }
    });
}