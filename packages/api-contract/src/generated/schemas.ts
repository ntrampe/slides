import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const ApiMeta = z
  .object({ apiVersion: z.string(), contractVersion: z.string() })
  .passthrough();
const FilterOperator = z.enum(["AND", "OR"]);
const QuerySettings = z
  .object({
    albumIds: z.array(z.string()),
    albumOperator: FilterOperator,
    personIds: z.array(z.string()),
    personOperator: FilterOperator,
    excludeAlbumIds: z.array(z.string()),
    excludePersonIds: z.array(z.string()),
    locationCountry: z.string().optional(),
    locationState: z.string().optional(),
    locationCity: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    globalOperator: FilterOperator,
    shuffle: z.boolean(),
  })
  .passthrough();
const SlideshowQueryRequest = QuerySettings.and(
  z.object({ seed: z.string() }).partial().passthrough()
);
const PhotoLocation = z
  .object({
    city: z.string(),
    state: z.string(),
    country: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  })
  .partial()
  .passthrough();
const PhotoCameraInfo = z
  .object({ make: z.string(), model: z.string(), lensModel: z.string() })
  .partial()
  .passthrough();
const PhotoExifSettings = z
  .object({
    fNumber: z.number(),
    exposureTime: z.string(),
    iso: z.number().int(),
    focalLength: z.number(),
  })
  .partial()
  .passthrough();
const Photo = z
  .object({
    id: z.string(),
    url: z.string().url(),
    inAppUrl: z.string().url().optional(),
    livePhotoVideoUrl: z.string().url().optional(),
    width: z.number().int().optional(),
    height: z.number().int().optional(),
    type: z.enum(["IMAGE", "VIDEO"]),
    createdAt: z.string().datetime({ offset: true }),
    description: z.string().optional(),
    rating: z.number().int().gte(0).lte(5).optional(),
    isFavorite: z.boolean(),
    tags: z.array(z.string()).optional(),
    location: PhotoLocation.optional(),
    camera: PhotoCameraInfo.optional(),
    exifSettings: PhotoExifSettings.optional(),
    orientation: z.string().optional(),
    duration: z.string().optional(),
  })
  .passthrough();
const SlideshowResponse = z
  .object({ photos: z.array(Photo), total: z.number().int() })
  .passthrough();
const ErrorResponse = z
  .object({
    error: z
      .object({
        type: z.enum(["network", "auth", "client", "server"]).optional(),
        message: z.string(),
        code: z.string().optional(),
      })
      .passthrough(),
  })
  .passthrough();
const PlaybackSettings = z
  .object({
    intervalMs: z.number().int(),
    autoplay: z.boolean(),
    layout: z.enum(["single", "split"]),
    photoScaleMode: z.enum(["fit_inside", "fill_crop", "stretch", "original"]),
    transitionType: z.enum(["fade", "slide", "none"]),
    transitionDuration: z.number(),
    photoAnimationType: z.enum([
      "none",
      "zoom-in",
      "zoom-out",
      "pan",
      "ken-burns",
    ]),
    photoAnimationDuration: z.number(),
    photoAnimationIntensity: z.number(),
    livePhotoEnabled: z.boolean(),
    livePhotoDelay: z.number(),
  })
  .passthrough();
const ConfigurationSettings = z
  .object({
    dateFormat: z.string(),
    clockUse24HourFormat: z.boolean(),
    weatherLat: z.number(),
    weatherLng: z.number(),
  })
  .passthrough();
const AppSettings = z
  .object({
    query: QuerySettings,
    playback: PlaybackSettings,
    configuration: ConfigurationSettings,
  })
  .passthrough();
const QuerySettingsUpdate = z
  .object({
    albumIds: z.array(z.string()),
    albumOperator: FilterOperator,
    personIds: z.array(z.string()),
    personOperator: FilterOperator,
    excludeAlbumIds: z.array(z.string()),
    excludePersonIds: z.array(z.string()),
    locationCountry: z.string(),
    locationState: z.string(),
    locationCity: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    globalOperator: FilterOperator,
    shuffle: z.boolean(),
  })
  .partial()
  .passthrough();
const PlaybackSettingsUpdate = z
  .object({
    intervalMs: z.number().int(),
    autoplay: z.boolean(),
    layout: z.enum(["single", "split"]),
    photoScaleMode: z.enum(["fit_inside", "fill_crop", "stretch", "original"]),
    transitionType: z.enum(["fade", "slide", "none"]),
    transitionDuration: z.number(),
    photoAnimationType: z.enum([
      "none",
      "zoom-in",
      "zoom-out",
      "pan",
      "ken-burns",
    ]),
    photoAnimationDuration: z.number(),
    photoAnimationIntensity: z.number(),
    livePhotoEnabled: z.boolean(),
    livePhotoDelay: z.number(),
  })
  .partial()
  .passthrough();
const ConfigurationSettingsUpdate = z
  .object({
    dateFormat: z.string(),
    clockUse24HourFormat: z.boolean(),
    weatherLat: z.number(),
    weatherLng: z.number(),
  })
  .partial()
  .passthrough();
const Album = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    thumbnailUrl: z.string().url(),
    assetCount: z.number().int(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
    shared: z.boolean(),
  })
  .passthrough();
const Person = z
  .object({
    id: z.string(),
    name: z.string(),
    birthDate: z.string().nullable(),
    thumbnailUrl: z.string().url(),
    isHidden: z.boolean(),
    isFavorite: z.boolean(),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const LocationItem = z
  .object({ id: z.string(), name: z.string(), count: z.number().int() })
  .passthrough();
const LocationHierarchy = z
  .object({
    countries: z.array(LocationItem),
    states: z.record(z.array(LocationItem)),
    cities: z.record(z.array(LocationItem)),
  })
  .passthrough();
const MapMarker = z
  .object({
    id: z.string(),
    lat: z.number(),
    lon: z.number(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
  })
  .passthrough();
const LocationSelection = z
  .object({ country: z.string(), state: z.string(), city: z.string() })
  .partial()
  .passthrough();
const WeatherData = z
  .object({
    temp: z.number(),
    condition: z.enum(["sunny", "cloudy", "rainy", "snowy", "stormy"]),
    city: z.string(),
  })
  .passthrough();

export const schemas = {
  ApiMeta,
  FilterOperator,
  QuerySettings,
  SlideshowQueryRequest,
  PhotoLocation,
  PhotoCameraInfo,
  PhotoExifSettings,
  Photo,
  SlideshowResponse,
  ErrorResponse,
  PlaybackSettings,
  ConfigurationSettings,
  AppSettings,
  QuerySettingsUpdate,
  PlaybackSettingsUpdate,
  ConfigurationSettingsUpdate,
  Album,
  Person,
  LocationItem,
  LocationHierarchy,
  MapMarker,
  LocationSelection,
  WeatherData,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/albums",
    alias: "getAlbums",
    description: `Returns all Immich albums with thumbnail URLs proxied through &#x60;/assets&#x60;.`,
    requestFormat: "json",
    response: z.object({ albums: z.array(Album) }).passthrough(),
    errors: [
      {
        status: 500,
        description: `Server error`,
        schema: ErrorResponse,
      },
      {
        status: 502,
        description: `Server error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/assets/:id/thumbnail",
    alias: "getAssetThumbnail",
    description: `Proxies the Immich thumbnail for the given asset ID.`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 401,
        description: `Authentication failed`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Resource not found`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/assets/:id/video",
    alias: "getAssetVideo",
    description: `Proxies the Immich live-photo video when &#x60;livePhotoEnabled&#x60; is true.`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 401,
        description: `Authentication failed`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Resource not found`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/events",
    alias: "getEvents",
    description: `Long-lived &#x60;text/event-stream&#x60; for real-time sync. Clients should treat events as
invalidation triggers and refetch via &#x60;GET /settings&#x60; (preserving URL overrides).

- &#x60;event: query_updated&#x60; — &#x60;data&#x60; is JSON &#x60;QuerySettings&#x60; (persisted query domain).
- &#x60;event: playback_updated&#x60; — &#x60;data&#x60; is JSON &#x60;PlaybackSettings&#x60;.
- &#x60;event: configuration_updated&#x60; — &#x60;data&#x60; is JSON &#x60;ConfigurationSettings&#x60;.
- &#x60;event: settings_cleared&#x60; — &#x60;data&#x60; is JSON &#x60;AppSettings&#x60; (resolved env defaults).

Comment heartbeats (&#x60;: ping&#x60;) are sent periodically to keep connections alive.
`,
    requestFormat: "json",
    response: z.void(),
  },
  {
    method: "get",
    path: "/locations",
    alias: "getLocations",
    description: `Returns a hierarchy of countries → states → cities derived from photo
EXIF data. Use this to populate filter pickers.
`,
    requestFormat: "json",
    response: LocationHierarchy,
    errors: [
      {
        status: 500,
        description: `Server error`,
        schema: ErrorResponse,
      },
      {
        status: 502,
        description: `Server error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/locations/markers",
    alias: "getLocationMarkers",
    description: `Returns all individual map markers from photo EXIF data.`,
    requestFormat: "json",
    response: z.object({ markers: z.array(MapMarker) }).passthrough(),
    errors: [
      {
        status: 500,
        description: `Server error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/locations/resolve",
    alias: "resolveLocation",
    requestFormat: "json",
    parameters: [
      {
        name: "country",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "state",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "city",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: z.union([LocationSelection, z.null()]),
    errors: [
      {
        status: 500,
        description: `Server error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/meta",
    alias: "getApiMeta",
    description: `Discovery endpoint. Compare &#x60;contractVersion&#x60; to the version your client was
built against. Bump OpenAPI &#x60;info.version&#x60; on breaking JSON changes.
`,
    requestFormat: "json",
    response: ApiMeta,
  },
  {
    method: "get",
    path: "/people",
    alias: "getPeople",
    description: `Returns all named people recognized by Immich with thumbnail URLs proxied through &#x60;/assets&#x60;.`,
    requestFormat: "json",
    response: z.object({ people: z.array(Person) }).passthrough(),
    errors: [
      {
        status: 500,
        description: `Server error`,
        schema: ErrorResponse,
      },
      {
        status: 502,
        description: `Server error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/settings",
    alias: "getSettings",
    description: `Returns the fully effective configuration: &#x60;DEFAULT_*&#x60; env defaults
shallow-merged with persisted per-domain overrides (&#x60;settings.query.json&#x60;,
&#x60;settings.playback.json&#x60;, &#x60;settings.configuration.json&#x60;), then optional URL query
overrides using bracket notation (e.g. &#x60;?query[shuffle]&#x3D;false&amp;playback[intervalMs]&#x3D;5000&#x60;;
array values use comma separation &#x60;query[albumIds]&#x3D;id1,id2&#x60;). URL overrides are
session-only and are not persisted. Ignored params: &#x60;seed&#x60;, &#x60;cursor&#x60;, &#x60;limit&#x60;.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "query",
        type: "Query",
        schema: z.object({}).partial().passthrough().optional(),
      },
    ],
    response: AppSettings,
    errors: [
      {
        status: 500,
        description: `Server error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/settings",
    alias: "deleteSettings",
    description: `Removes all persisted overrides (all three domain files), reverting to env defaults.
Broadcasts &#x60;settings_cleared&#x60; on SSE.
`,
    requestFormat: "json",
    response: z.object({ message: z.string() }).partial().passthrough(),
  },
  {
    method: "patch",
    path: "/settings/configuration",
    alias: "patchConfigurationSettings",
    description: `Shallow-merges the partial &#x60;ConfigurationSettingsUpdate&#x60; body with existing persisted
configuration overrides in &#x60;settings.configuration.json&#x60; and returns the full effective
&#x60;AppSettings&#x60;. Broadcasts &#x60;configuration_updated&#x60; on SSE.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ConfigurationSettingsUpdate,
      },
    ],
    response: AppSettings,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/settings/configuration",
    alias: "deleteConfigurationSettings",
    description: `Removes configuration overrides, reverting configuration domain to env defaults.
Broadcasts &#x60;configuration_updated&#x60; on SSE.
`,
    requestFormat: "json",
    response: z.object({ message: z.string() }).partial().passthrough(),
  },
  {
    method: "patch",
    path: "/settings/playback",
    alias: "patchPlaybackSettings",
    description: `Shallow-merges the partial &#x60;PlaybackSettingsUpdate&#x60; body with existing persisted
playback overrides in &#x60;settings.playback.json&#x60; and returns the full effective
&#x60;AppSettings&#x60;. Broadcasts &#x60;playback_updated&#x60; on SSE.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: PlaybackSettingsUpdate,
      },
    ],
    response: AppSettings,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/settings/playback",
    alias: "deletePlaybackSettings",
    description: `Removes playback overrides, reverting playback domain to env defaults.
Broadcasts &#x60;playback_updated&#x60; on SSE.
`,
    requestFormat: "json",
    response: z.object({ message: z.string() }).partial().passthrough(),
  },
  {
    method: "patch",
    path: "/settings/query",
    alias: "patchQuerySettings",
    description: `Shallow-merges the partial &#x60;QuerySettingsUpdate&#x60; body with existing persisted
query overrides in &#x60;settings.query.json&#x60; and returns the full effective
&#x60;AppSettings&#x60;. Broadcasts &#x60;query_updated&#x60; on SSE.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: QuerySettingsUpdate,
      },
    ],
    response: AppSettings,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/settings/query",
    alias: "deleteQuerySettings",
    description: `Removes query overrides, reverting query domain to env defaults.
Broadcasts &#x60;query_updated&#x60; on SSE.
`,
    requestFormat: "json",
    response: z.object({ message: z.string() }).partial().passthrough(),
  },
  {
    method: "post",
    path: "/slideshow/query",
    alias: "postSlideshowQuery",
    description: `Stateless photo query. Accepts query settings in the JSON body (avoids URL length
limits for large album ID lists). Returns the full ordered list; shuffle is
applied server-side when &#x60;shuffle&#x60; is true. The server does not retain kiosk
session or playback progress.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: SlideshowQueryRequest,
      },
    ],
    response: SlideshowResponse,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Server error`,
        schema: ErrorResponse,
      },
      {
        status: 502,
        description: `Server error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/weather",
    alias: "getWeather",
    description: `Returns current weather for &#x60;configuration.weatherLat&#x60; / &#x60;configuration.weatherLng&#x60; from
effective settings. Supports bracket-notation URL overrides (e.g.
&#x60;?configuration[weatherLat]&#x3D;51.5&#x60;). Returns &#x60;503&#x60; when &#x60;OWM_KEY&#x60; is unset.
`,
    requestFormat: "json",
    response: WeatherData,
    errors: [
      {
        status: 404,
        description: `Resource not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Server error`,
        schema: ErrorResponse,
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
