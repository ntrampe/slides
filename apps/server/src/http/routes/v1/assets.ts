import { Router } from 'express';
import type { ImmichClient } from '../../../infra/ImmichClient.js';
import { asyncHandler, queryString } from '../../middleware/asyncHandler.js';
import { streamToResponse } from '../../middleware/streamToResponse.js';

/**
 * Streams Immich binary media through the API with the server-side key injected.
 * Keeping this proxy is necessary so clients never see the Immich API key and
 * so media URLs are stable, absolute, and client-agnostic.
 */
export function createAssetsRouter(immich: ImmichClient): Router {
    const router = Router();

    // Image thumbnails/previews. Forwards query params (e.g. ?size=preview).
    router.get(
        '/:id/thumbnail',
        asyncHandler(async (req, res) => {
            const asset = await immich.fetchAsset(
                `/api/assets/${req.params.id}/thumbnail${queryString(req)}`,
                req.headers.range
            );
            streamToResponse(asset, res);
        })
    );

    // Video playback (used for live photos), supports range requests.
    router.get(
        '/:id/video',
        asyncHandler(async (req, res) => {
            const asset = await immich.fetchAsset(
                `/api/assets/${req.params.id}/video/playback`,
                req.headers.range
            );
            streamToResponse(asset, res);
        })
    );

    return router;
}
