import { Router } from 'express';
import { buildDefaultSettings } from '../config/defaultSettings';

/**
 * Config endpoint - serves default application settings
 * GET /api/config -> AppSettings
 */
export function createConfigRouter(): Router {
    const router = Router();

    router.get('/', (_req, res) => {
        console.log(`[Config] Fetching default settings`);
        const defaultSettings = buildDefaultSettings();
        res.json(defaultSettings);
    });

    return router;
}