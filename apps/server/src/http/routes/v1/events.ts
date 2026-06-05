import { Router } from 'express';
import type { EventsHub } from '../../../services/EventsHub.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

const PING_INTERVAL_MS = 30_000;

export function createEventsRouter(eventsHub: EventsHub): Router {
    const router = Router();

    router.get(
        '/',
        asyncHandler(async (req, res) => {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders?.();

            let cleanedUp = false;
            let pingTimer: ReturnType<typeof setInterval> | null = null;

            const writeChunk = (chunk: string): boolean => {
                if (res.writableEnded || res.destroyed) {
                    return false;
                }

                try {
                    res.write(chunk);
                    return true;
                } catch {
                    return false;
                }
            };

            const cleanup = () => {
                if (cleanedUp) {
                    return;
                }
                cleanedUp = true;

                unsubscribe();
                if (pingTimer != null) {
                    clearInterval(pingTimer);
                    pingTimer = null;
                }
            };

            const unsubscribe = eventsHub.subscribe((event) => {
                const ok = writeChunk(
                    `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`
                );
                if (!ok) {
                    cleanup();
                }
            });

            pingTimer = setInterval(() => {
                if (!writeChunk(': ping\n\n')) {
                    cleanup();
                }
            }, PING_INTERVAL_MS);

            req.on('close', cleanup);
            res.on('error', cleanup);
        })
    );

    return router;
}
