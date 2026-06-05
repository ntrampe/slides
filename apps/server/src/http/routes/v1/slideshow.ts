import express, { Router } from 'express';
import { schemas } from '@slides/api-contract';
import type { ServerConfig } from '../../../config.js';
import type { SlideshowService } from '../../../services/SlideshowService.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { createLinkBuilder } from '../../../infra/LinkBuilder.js';
import { toSlideshowResponse } from '../../mappers/index.js';
import { ClientError } from '@slides/shared/errors';

export function createSlideshowRouter(
    service: SlideshowService,
    config: ServerConfig
): Router {
    const router = Router();
    router.use(express.json());

    router.post(
        '/query',
        asyncHandler(async (req, res) => {
            const result = schemas.SlideshowQueryRequest.safeParse(req.body);
            if (!result.success) {
                throw new ClientError(result.error.message, 400);
            }

            const links = createLinkBuilder(req, config);
            const slideshow = await service.queryPhotos(result.data, links);
            res.json(toSlideshowResponse(slideshow));
        })
    );

    return router;
}
