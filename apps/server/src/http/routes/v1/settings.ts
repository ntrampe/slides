import express, { Router } from 'express';
import type { SettingsService } from '../../../services/SettingsService.js';
import type { EventsHub } from '../../../services/EventsHub.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import {
    parseDisplaySettings,
    parsePlaybackSettings,
    parseQuerySettings,
} from '../../settingsValidation.js';
import { toAppSettingsDto } from '../../mappers/index.js';

export function createSettingsRouter(
    service: SettingsService,
    eventsHub: EventsHub
): Router {
    const router = Router();
    router.use(express.json());

    router.get(
        '/',
        asyncHandler(async (req, res) => {
            res.json(toAppSettingsDto(await service.getEffective(req.query)));
        })
    );

    router.patch(
        '/query',
        asyncHandler(async (req, res) => {
            const body = parseQuerySettings(req.body);
            const effective = await service.setQuerySettings(body);
            const dto = toAppSettingsDto(effective);
            eventsHub.broadcastQueryUpdated(dto.query);
            res.json(dto);
        })
    );

    router.patch(
        '/playback',
        asyncHandler(async (req, res) => {
            const body = parsePlaybackSettings(req.body);
            const effective = await service.setPlaybackSettings(body);
            const dto = toAppSettingsDto(effective);
            eventsHub.broadcastPlaybackUpdated(dto.playback);
            res.json(dto);
        })
    );

    router.patch(
        '/display',
        asyncHandler(async (req, res) => {
            const body = parseDisplaySettings(req.body);
            const effective = await service.setDisplaySettings(body);
            const dto = toAppSettingsDto(effective);
            eventsHub.broadcastDisplayUpdated(dto.display);
            res.json(dto);
        })
    );

    router.delete(
        '/',
        asyncHandler(async (_req, res) => {
            const defaults = await service.clearAllOverrides();
            const dto = toAppSettingsDto(defaults);
            eventsHub.broadcastSettingsCleared(dto);
            res.json({ message: 'Settings overrides cleared' });
        })
    );

    router.delete(
        '/query',
        asyncHandler(async (_req, res) => {
            const effective = await service.clearDomainOverrides('query');
            const dto = toAppSettingsDto(effective);
            eventsHub.broadcastQueryUpdated(dto.query);
            res.json({ message: 'Query settings overrides cleared' });
        })
    );

    router.delete(
        '/playback',
        asyncHandler(async (_req, res) => {
            const effective = await service.clearDomainOverrides('playback');
            const dto = toAppSettingsDto(effective);
            eventsHub.broadcastPlaybackUpdated(dto.playback);
            res.json({ message: 'Playback settings overrides cleared' });
        })
    );

    router.delete(
        '/display',
        asyncHandler(async (_req, res) => {
            const effective = await service.clearDomainOverrides('display');
            const dto = toAppSettingsDto(effective);
            eventsHub.broadcastDisplayUpdated(dto.display);
            res.json({ message: 'Display settings overrides cleared' });
        })
    );

    return router;
}
