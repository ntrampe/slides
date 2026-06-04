import { Router } from 'express';
import type { ServerConfig } from '../../../config.js';
import { ImmichClient } from '../../../infra/ImmichClient.js';
import { ImmichPhotoGateway } from '../../../infra/ImmichPhotoGateway.js';
import { PhotoQueryService } from '../../../services/PhotoQueryService.js';
import { CatalogService } from '../../../services/CatalogService.js';
import { WeatherService } from '../../../services/WeatherService.js';
import { SettingsService } from '../../../services/SettingsService.js';
import { SlideshowService } from '../../../services/SlideshowService.js';
import { buildDefaultSettings } from '../../../domain/defaultSettings.js';
import { createCatalogRouters } from './catalog.js';
import { createWeatherRouter } from './weather.js';
import { createSettingsRouter } from './settings.js';
import { createSlideshowRouter } from './slideshow.js';
import { createAssetsRouter } from './assets.js';

export function createV1Router(config: ServerConfig): Router {
    const router = Router();

    const defaults = buildDefaultSettings();

    const immich = new ImmichClient(config);
    const photoGateway = new ImmichPhotoGateway(immich);
    const photoService = new PhotoQueryService(photoGateway);
    const catalogService = new CatalogService(immich);
    const weatherService = new WeatherService(config);
    const settingsService = new SettingsService(defaults);
    const slideshowService = new SlideshowService(photoService, settingsService);

    const catalog = createCatalogRouters(catalogService, immich, config);

    router.use('/slideshow', createSlideshowRouter(slideshowService, config));
    router.use('/albums', catalog.albums);
    router.use('/people', catalog.people);
    router.use('/locations', catalog.locations);
    router.use('/weather', createWeatherRouter(weatherService, settingsService));
    router.use('/settings', createSettingsRouter(settingsService));
    router.use('/assets', createAssetsRouter(immich));

    return router;
}
