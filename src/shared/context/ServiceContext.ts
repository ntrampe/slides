import { createContext, useContext } from 'react';

import { ImmichPhotoService, MockPhotoService, type PhotoService } from "../../features/photos";
import { MockWeatherService } from "../../features/weather/services/MockWeatherService";
import { OWMWeatherService } from "../../features/weather/services/OWMWeatherService";
import type { WeatherService } from "../../features/weather/types";
import type { SettingsService } from '../../features/settings';
import { LocalSettingsService } from '../../features/settings/services/LocalStorageSettingsService';
import type { PeopleService } from '../../features/people/types';
import { MockPeopleService } from '../../features/people/services/MockPeopleService';
import { ImmichPeopleService } from '../../features/people/services/ImmichPeopleService';

const isMock = import.meta.env.VITE_USE_MOCK === 'true'

// Define explicit type for app services
export type AppServices = {
    photos: PhotoService;
    weather: WeatherService;
    settings: SettingsService;
    people: PeopleService;
};

// Mock services
const mockServices: AppServices = {
    photos: new MockPhotoService(),
    weather: new MockWeatherService(),
    settings: new LocalSettingsService(),
    people: new MockPeopleService()
};

// Live services
const liveServices: AppServices = {
    photos: new ImmichPhotoService(),
    weather: new OWMWeatherService(import.meta.env.VITE_OWM_KEY || ''),
    settings: new LocalSettingsService(),
    people: new ImmichPeopleService()
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