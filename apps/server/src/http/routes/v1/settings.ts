import express, { Router } from 'express';
import type { SettingsService } from '../../../services/SettingsService.js';
import { asyncHandler, queryString } from '../../middleware/asyncHandler.js';
import { parseSettingsOverrides } from '../../settingsValidation.js';
import { toAppSettingsDto } from '../../mappers/index.js';

export function createSettingsRouter(service: SettingsService): Router {
    const router = Router();
    router.use(express.json());

    router.get('/defaults', (_req, res) => {
        res.json(toAppSettingsDto(service.getDefaults()));
    });

    router.get(
        '/resolved',
        asyncHandler(async (req, res) => {
            res.json(toAppSettingsDto(await service.resolve(queryString(req))));
        })
    );

    router.get(
        '/',
        asyncHandler(async (_req, res) => {
            res.json(await service.getOverrides());
        })
    );

    router.put(
        '/',
        asyncHandler(async (req, res) => {
            const overrides = parseSettingsOverrides(req.body);
            await service.setOverrides(overrides);
            res.json(await service.getOverrides());
        })
    );

    router.delete(
        '/',
        asyncHandler(async (_req, res) => {
            await service.clearOverrides();
            res.json({ message: 'Settings overrides cleared' });
        })
    );

    return router;
}
