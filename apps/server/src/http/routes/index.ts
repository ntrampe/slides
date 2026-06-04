import { Router, type Request, type Response, type NextFunction } from 'express';
import type { ServerConfig } from '../../config.js';
import { createV1Router } from './v1/index.js';
import { errorHandler } from '../middleware/errorHandler';

/**
 * Creates the main API router. All endpoints live under the versioned
 * /api/v1 namespace and return domain models (never raw Immich DTOs).
 */
export function createApiRouter(config: ServerConfig): Router {
    const router = Router();

    const corsOrigin = config.CORS_ALLOWED_ORIGIN ?? '*';
    router.use((req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Access-Control-Allow-Origin', corsOrigin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        if (req.method === 'OPTIONS') {
            res.sendStatus(204);
            return;
        }
        next();
    });

    router.use('/v1', createV1Router(config));

    // Unknown API route -> JSON 404 (so the SPA catch-all never swallows it).
    router.use((_req, res) => {
        res.status(404).json({ error: { type: 'client', message: 'Not found' } });
    });

    // Central error -> HTTP translation for any error bubbling up from routes.
    router.use(errorHandler);

    return router;
}
