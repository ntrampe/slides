import { createContext, useContext } from 'react';

import { ImmichPhotoService, MockPhotoService, type PhotoService } from "../../features/photos";
import { MockWeatherService } from "../../features/weather/services/MockWeatherService";
import { OWMWeatherService } from "../../features/weather/services/OWMWeatherService";
import type { WeatherService } from "../../features/weather/types";

const isMock = true; // import.meta.env.VITE_USE_MOCK === 'true'

export const photoService: PhotoService = isMock
    ? new MockPhotoService()
    : new ImmichPhotoService(
        import.meta.env.VITE_IMMICH_URL || '',
        import.meta.env.VITE_IMMICH_KEY || ''
    );

export const weatherService: WeatherService = isMock
    ? new MockWeatherService()
    : new OWMWeatherService(import.meta.env.VITE_OWM_KEY || '');

export const services = {
    photos: photoService,
    weather: weatherService,
};

export type AppServices = typeof services;

export const ServiceContext = createContext<AppServices | null>(null);

export const useServices = () => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error("useServices must be used within a ServiceContext.Provider");
    }
    return context;
};