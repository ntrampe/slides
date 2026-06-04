import type { components } from './generated/openapi.js';

export type { paths, operations } from './generated/openapi.js';
export { schemas } from './generated/schemas.js';

export type Photo = components['schemas']['Photo'];
/** @deprecated Use `Photo` — kept for client revival helpers during migration */
export type SerializedPhoto = Photo;
export type SlideshowResponse = components['schemas']['SlideshowResponse'];
export type AppSettings = components['schemas']['AppSettings'];
export type PhotoFilterParams = components['schemas']['PhotoFilterParams'];
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

export type ObjectFit = AppSettings['photos']['fit'];
export type LayoutMode = AppSettings['slideshow']['layout'];
export type PhotoAnimationType = AppSettings['photos']['animation']['type'];
export type SlideshowTransitionType = AppSettings['slideshow']['transition']['type'];
export type ThemeMode = AppSettings['theme']['mode'];
export type WeatherCondition = WeatherData['condition'];
