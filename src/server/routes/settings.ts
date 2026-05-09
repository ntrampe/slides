import express, { Router } from 'express';
import type { AppSettings } from '../../features/settings/types';
import { buildDefaultSettings } from '../config/defaultSettings';

let userOverrides: AppSettings | null = null;

/**
 * Tiny in-memory API for user settings overrides.
 * Data resets when the server restarts.
 */
export function createSettingsRouter(): Router {
    const router = Router();
    router.use(express.json());

    router.get('/defaults', (_req, res) => {
        console.log(`[Settings] Fetching default settings`);
        const defaultSettings = buildDefaultSettings();
        res.json(defaultSettings);
    });

    router.get('/', (_req, res) => {
        res.json(userOverrides ?? {});
    });

    router.put('/', (req, res) => {
        userOverrides = req.body as AppSettings;
        res.status(204).send();
    });

    router.delete('/', (_req, res) => {
        userOverrides = null;
        res.status(204).send();
    });

    return router;
}
