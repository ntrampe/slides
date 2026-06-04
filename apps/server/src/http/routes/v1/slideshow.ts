import { Router } from 'express';
import type { SlideshowService } from '../../../services/SlideshowService.js';
import type { ServerConfig } from '../../../config.js';
import { createLinkBuilder } from '../../../infra/LinkBuilder.js';
import { asyncHandler, queryString } from '../../middleware/asyncHandler.js';
import { toSlideshowResponse } from '../../mappers/index.js';

export function createSlideshowRouter(service: SlideshowService, config: ServerConfig): Router {
    const router = Router();

    router.get(
        '/',
        asyncHandler(async (req, res) => {
            const seed = typeof req.query.seed === 'string' ? req.query.seed : undefined;
            const result = await service.getSlideshow(queryString(req), createLinkBuilder(req, config), {
                seed,
            });
            res.json(toSlideshowResponse(result));
        })
    );

    return router;
}
