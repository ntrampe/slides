import { createContext, useContext } from 'react';

import { ImmichPhotoRepo, MockPhotoRepo, type PhotoRepo } from "../../features/photos";
import { MockWeatherService } from "../../features/weather/services/MockWeatherService";
import { OWMWeatherService } from "../../features/weather/services/OWMWeatherService";
import type { WeatherService } from "../../features/weather/types";
import { LocalStorageSettingsOverridesRepo } from '../../features/settings/repos/LocalStorageSettingsOverridesRepo';
import { ApiSettingsOverridesRepo } from '../../features/settings/repos/ApiSettingsOverridesRepo';
import type { PeopleRepo } from '../../features/people/types';
import { MockPeopleRepo } from '../../features/people/repos/MockPeopleRepo';
import { ImmichPeopleRepo } from '../../features/people/repos/ImmichPeopleRepo';
import type { AlbumRepo } from '../../features/albums/types';
import { MockAlbumRepo } from '../../features/albums/repos/MockAlbumRepo';
import { ImmichAlbumRepo } from '../../features/albums/repos/ImmichAlbumRepo';
import type { LocationRepo } from '../../features/locations/types';
import { MockLocationRepo } from '../../features/locations/repos/MockLocationRepo';
import { ImmichLocationRepo } from '../../features/locations/repos/ImmichLocationRepo';
import type { SettingsDefaultsRepo, SettingsOverridesRepo } from '../../features/settings';
import { ApiSettingsDefaultsRepo } from '../../features/settings/repos/ApiSettingsDefaultsRepo';
import { MockSettingsDefaultsRepo } from '../../features/settings/repos/MockSettingsDefaultsRepo';

const isMock = import.meta.env.VITE_USE_MOCK === 'true'

// Define explicit type for app services
export type AppServices = {
    photos: PhotoRepo;
    weather: WeatherService;
    settingsOverrides: SettingsOverridesRepo;
    people: PeopleRepo;
    albums: AlbumRepo;
    locations: LocationRepo;
    settingsDefaults: SettingsDefaultsRepo;
};

// Mock services
const mockServices: AppServices = {
    photos: new MockPhotoRepo(),
    weather: new MockWeatherService(),
    settingsOverrides: new LocalStorageSettingsOverridesRepo(),
    people: new MockPeopleRepo(),
    albums: new MockAlbumRepo(),
    locations: new MockLocationRepo(),
    settingsDefaults: new MockSettingsDefaultsRepo()
};

// Live services
const liveServices: AppServices = {
    photos: new ImmichPhotoRepo(),
    weather: new OWMWeatherService(),
    settingsOverrides: new ApiSettingsOverridesRepo(),
    people: new ImmichPeopleRepo(),
    albums: new ImmichAlbumRepo(),
    locations: new ImmichLocationRepo(),
    settingsDefaults: new ApiSettingsDefaultsRepo()
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