import { createContext, useContext } from 'react';

import { ImmichPhotoService, MockPhotoService, type PhotoService } from "../../features/photos";
import { MockWeatherService } from "../../features/weather/services/MockWeatherService";
import { OWMWeatherService } from "../../features/weather/services/OWMWeatherService";
import type { WeatherService } from "../../features/weather/types";
import type { SettingsService } from '../../features/settings';
import { LocalSettingsService } from '../../features/settings/services/LocalStorageSettingsService';

const isMock = true; // import.meta.env.VITE_USE_MOCK === 'true'

// Define explicit type for app services
export type AppServices = {
    photos: PhotoService;
    weather: WeatherService;
    settings: SettingsService;
};

// Mock services
const mockServices: AppServices = {
    photos: new MockPhotoService(),
    weather: new MockWeatherService(),
    settings: new LocalSettingsService()
};

// Live services
const liveServices: AppServices = {
    photos: new ImmichPhotoService(
        import.meta.env.VITE_IMMICH_URL || '',
        import.meta.env.VITE_IMMICH_KEY || ''
    ),
    weather: new OWMWeatherService(import.meta.env.VITE_OWM_KEY || ''),
    settings: new LocalSettingsService()
};

// Select services based on flag
export const services: AppServices = isMock ? mockServices : liveServices;

export const ServiceContext = createContext<AppServices | null>(null);

export const useServices = () => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error("useServices must be used within a ServiceContext.Provider");
    }
    return context;
};