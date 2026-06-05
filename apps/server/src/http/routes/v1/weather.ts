import { Router } from 'express';
import type { WeatherService } from '../../../services/WeatherService.js';
import type { SettingsService } from '../../../services/SettingsService.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { NotFoundError } from '@slides/shared/errors';
import { toWeatherDataDto } from '../../mappers/index.js';

export function createWeatherRouter(service: WeatherService, settings: SettingsService): Router {
    const router = Router();

    router.get(
        '/',
        asyncHandler(async (req, res) => {
            const effective = await settings.getEffective(req.query);

            if (!effective.display.showWeather) {
                throw new NotFoundError('Weather is not enabled in the current settings');
            }

            res.json(
                toWeatherDataDto(
                    await service.getWeather(
                        effective.display.weatherLat,
                        effective.display.weatherLng
                    )
                )
            );
        })
    );

    return router;
}
