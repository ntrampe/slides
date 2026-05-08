import { Router } from 'express';
import type { ServerConfig } from '../config';
import { createImmichRouter } from './immich';
import { createWeatherRouter } from './weather';
import { createConfigRouter } from './config';
import { createSettingsRouter } from './settings';

/**
 * Creates the main API router with all sub-routes
 * Mounts all API routes under /api/*
 */
export function createApiRouter(config: ServerConfig): Router {
    const router = Router();

    // Mount sub-routes
    router.use('/immich', createImmichRouter(config));
    router.use('/weather', createWeatherRouter(config));
    router.use('/config', createConfigRouter());
    router.use('/settings', createSettingsRouter());

    return router;
}
