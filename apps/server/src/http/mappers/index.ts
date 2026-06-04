import type {
    Album,
    AppSettings,
    LocationHierarchy,
    LocationSelection,
    MapMarker,
    Person,
    Photo,
    SlideshowResponse,
    WeatherData,
} from '@slides/api-contract';
import type {
    DomainAlbum,
    DomainAppSettings,
    DomainLocationHierarchy,
    DomainLocationSelection,
    DomainMapMarker,
    DomainPerson,
    DomainPhoto,
    DomainSlideshowResult,
    DomainWeatherData,
} from '../../domain/index.js';

export function toPhotoDto(photo: DomainPhoto): Photo {
    return photo;
}

export function toSlideshowResponse(result: DomainSlideshowResult): SlideshowResponse {
    return {
        photos: result.photos.map(toPhotoDto),
        total: result.total,
    };
}

export function toAppSettingsDto(settings: DomainAppSettings): AppSettings {
    return settings;
}

export function fromAppSettingsDto(settings: AppSettings): DomainAppSettings {
    return settings;
}

export function toAlbumDto(album: DomainAlbum): Album {
    return album;
}

export function toPersonDto(person: DomainPerson): Person {
    return person;
}

export function toLocationHierarchyDto(hierarchy: DomainLocationHierarchy): LocationHierarchy {
    return hierarchy;
}

export function toMapMarkerDto(marker: DomainMapMarker): MapMarker {
    return marker;
}

export function toLocationSelectionDto(selection: DomainLocationSelection): LocationSelection {
    return selection;
}

export function toWeatherDataDto(weather: DomainWeatherData): WeatherData {
    return weather;
}
