import { Router } from 'express';
import type { WeatherService } from '../../../services/WeatherService.js';
import type { SettingsService } from '../../../services/SettingsService.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { toWeatherDataDto } from '../../mappers/index.js';

export function createWeatherRouter(service: WeatherService, settings: SettingsService): Router {
    const router = Router();

    router.get(
        '/',
        asyncHandler(async (req, res) => {
            const effective = await settings.getEffective(req.query);

            res.json(
                toWeatherDataDto(
                    await service.getWeather(
                        effective.configuration.weatherLat,
                        effective.configuration.weatherLng
                    )
                )
            );
        })
    );

    return router;
}
