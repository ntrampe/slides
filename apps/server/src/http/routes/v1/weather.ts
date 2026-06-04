import { Router } from 'express';
import type { WeatherService } from '../../../services/WeatherService.js';
import type { SettingsService } from '../../../services/SettingsService.js';
import { asyncHandler, queryString } from '../../middleware/asyncHandler.js';
import { NotFoundError } from '@slides/shared/errors';
import { toWeatherDataDto } from '../../mappers/index.js';

export function createWeatherRouter(service: WeatherService, settings: SettingsService): Router {
    const router = Router();

    router.get(
        '/',
        asyncHandler(async (req, res) => {
            const resolved = await settings.resolve(queryString(req));

            if (!resolved.weather.enabled) {
                throw new NotFoundError('Weather is not enabled in the current settings');
            }

            const { lat, lng } = resolved.weather.location;
            res.json(toWeatherDataDto(await service.getWeather(lat, lng)));
        })
    );

    return router;
}
