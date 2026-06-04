import { Router } from 'express';
import type { ApiMeta } from '@slides/api-contract';
import { SLIDES_API_VERSION, SLIDES_CONTRACT_VERSION } from '@slides/shared/apiVersions';

export function createMetaRouter(): Router {
    const router = Router();

    router.get('/', (_req, res) => {
        const body: ApiMeta = {
            apiVersion: SLIDES_API_VERSION,
            contractVersion: SLIDES_CONTRACT_VERSION,
        };
        res.json(body);
    });

    return router;
}
