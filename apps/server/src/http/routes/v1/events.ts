import { Router } from 'express';
import type { EventsHub } from '../../../services/EventsHub.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export function createEventsRouter(eventsHub: EventsHub): Router {
    const router = Router();

    router.get(
        '/',
        asyncHandler(async (req, res) => {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders?.();

            eventsHub.addClient(res);

            req.on('close', () => {
                eventsHub.removeClient(res);
            });
        })
    );

    return router;
}
