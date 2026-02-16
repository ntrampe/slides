import { Router } from 'express';
import type { ServerConfig } from '../config';
import { createImmichRouter } from './immich';
import { createWeatherRouter } from './weather';

/**
 * Creates the main API router with all sub-routes
 * Mounts all API routes under /api/*
 */
export function createApiRouter(config: ServerConfig): Router {
    const router = Router();

    // Mount sub-routes
    router.use('/immich', createImmichRouter(config));
    router.use('/weather', createWeatherRouter(config));

    return router;
}
