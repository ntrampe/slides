import type { components } from './generated/openapi.js';

export type { paths, operations } from './generated/openapi.js';
export { schemas } from './generated/schemas.js';
export { settingsUrlSchemas } from './settingsUrlSchemas.js';
export type { UrlQueryOverrides } from './settingsUrlSchemas.js';

export type Photo = components['schemas']['Photo'];
/** @deprecated Use `Photo` — kept for client revival helpers during migration */
export type SerializedPhoto = Photo;
export type SlideshowResponse = components['schemas']['SlideshowResponse'];
export type SlideshowQueryRequest = components['schemas']['SlideshowQueryRequest'];
export type AppSettings = components['schemas']['AppSettings'];
export type QuerySettings = components['schemas']['QuerySettings'];
export type PlaybackSettings = components['schemas']['PlaybackSettings'];
export type DisplaySettings = components['schemas']['DisplaySettings'];
export type PhotoLocation = components['schemas']['PhotoLocation'];
export type PhotoCameraInfo = components['schemas']['PhotoCameraInfo'];
export type PhotoExifSettings = components['schemas']['PhotoExifSettings'];
export type FilterOperator = components['schemas']['FilterOperator'];
export type Album = components['schemas']['Album'];
export type Person = components['schemas']['Person'];
export type LocationHierarchy = components['schemas']['LocationHierarchy'];
export type LocationItem = components['schemas']['LocationItem'];
export type LocationSelection = components['schemas']['LocationSelection'];
export type MapMarker = components['schemas']['MapMarker'];
export type WeatherData = components['schemas']['WeatherData'];
export type ApiMeta = components['schemas']['ApiMeta'];
export type ErrorResponse = components['schemas']['ErrorResponse'];
export type ApiErrorEnvelope = ErrorResponse;

export type ObjectFit = PlaybackSettings['photoFit'];
export type LayoutMode = PlaybackSettings['layout'];
export type PhotoAnimationType = PlaybackSettings['photoAnimationType'];
export type SlideshowTransitionType = PlaybackSettings['transitionType'];
export type ThemeMode = DisplaySettings['themeMode'];
export type WeatherCondition = WeatherData['condition'];
