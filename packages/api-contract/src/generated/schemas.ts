import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const ApiMeta = z
  .object({ apiVersion: z.string(), contractVersion: z.string() })
  .passthrough();
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
const FilterOperator = z.enum(["AND", "OR"]);
const PhotoFilterParams = z
  .object({
    albumIds: z.array(z.string()),
    albumOperator: FilterOperator,
    personIds: z.array(z.string()),
    personOperator: FilterOperator,
    excludeAlbumIds: z.array(z.string()),
    excludePersonIds: z.array(z.string()),
    location: z
      .object({ country: z.string(), state: z.string(), city: z.string() })
      .partial()
      .passthrough(),
    startDate: z.string(),
    endDate: z.string(),
    globalOperator: FilterOperator,
  })
  .partial()
  .passthrough();
const AppSettings = z
  .object({
    slideshow: z
      .object({
        layout: z.enum(["single", "split"]),
        intervalMs: z.number().int(),
        shuffle: z.boolean(),
        autoplay: z.boolean(),
        filter: PhotoFilterParams,
        transition: z
          .object({
            type: z.enum(["fade", "slide", "none"]),
            duration: z.number(),
          })
          .passthrough(),
        ui: z.object({ showProgressBar: z.boolean() }).passthrough(),
      })
      .passthrough(),
    photos: z
      .object({
        fit: z.enum(["contain", "cover", "fill", "none", "scale-down"]),
        animation: z
          .object({
            type: z.enum(["none", "zoom-in", "zoom-out", "pan", "ken-burns"]),
            duration: z.number(),
            intensity: z.number(),
          })
          .passthrough(),
        livePhoto: z
          .object({ enabled: z.boolean(), delay: z.number() })
          .passthrough(),
        metadata: z
          .object({ enabled: z.boolean(), dateFormat: z.string() })
          .passthrough(),
      })
      .passthrough(),
    clock: z
      .object({
        enabled: z.boolean(),
        use24HourFormat: z.boolean(),
        dateFormat: z.string(),
      })
      .passthrough(),
    weather: z
      .object({
        enabled: z.boolean(),
        location: z.object({ lat: z.number(), lng: z.number() }).passthrough(),
      })
      .passthrough(),
    theme: z.object({ mode: z.enum(["light", "dark"]) }).passthrough(),
    debug: z.object({ showDebugStats: z.boolean() }).passthrough(),
    support: z.object({ enabled: z.boolean() }).passthrough(),
  })
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
  PhotoLocation,
  PhotoCameraInfo,
  PhotoExifSettings,
  Photo,
  SlideshowResponse,
  ErrorResponse,
  FilterOperator,
  PhotoFilterParams,
  AppSettings,
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
        description: `Server error or upstream Immich error`,
        schema: ErrorResponse,
      },
      {
        status: 502,
        description: `Server error or upstream Immich error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/assets/:id/thumbnail",
    alias: "getAssetThumbnail",
    description: `Proxies the Immich thumbnail for the given asset ID, injecting the server
API key. Returns binary image data. Use this URL directly in &#x60;&lt;img src&gt;&#x60;
or a native image loader — do not parse as JSON.

Photo URLs in &#x60;SlideshowResponse.photos[].url&#x60; already point here.
`,
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
        description: `Authentication failed — invalid or missing Immich API key`,
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
    description: `Proxies the Immich live-photo video for the given asset ID. Only relevant
when &#x60;photos.livePhoto.enabled&#x60; is true and &#x60;Photo.livePhotoVideoUrl&#x60; is
set. Returns binary video data.
`,
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
        description: `Authentication failed — invalid or missing Immich API key`,
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
    path: "/locations",
    alias: "getLocations",
    description: `Returns a hierarchy of countries → states → cities derived from photo
EXIF data. Use this to populate filter pickers.

&#x60;cities&#x60; is keyed by &#x60;&quot;country:state&quot;&#x60; (not bare &#x60;state&#x60;) so that
same-named states in different countries are unambiguous. City IDs use
the compound &#x60;&quot;country:state:city&quot;&#x60; format; state IDs use
&#x60;&quot;country:state&quot;&#x60;.
`,
    requestFormat: "json",
    response: LocationHierarchy,
    errors: [
      {
        status: 500,
        description: `Server error or upstream Immich error`,
        schema: ErrorResponse,
      },
      {
        status: 502,
        description: `Server error or upstream Immich error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/locations/markers",
    alias: "getLocationMarkers",
    description: `Returns all individual map markers (lat/lon + city/state/country) from photo EXIF data.`,
    requestFormat: "json",
    response: z.object({ markers: z.array(MapMarker) }).passthrough(),
    errors: [
      {
        status: 500,
        description: `Server error or upstream Immich error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/locations/resolve",
    alias: "resolveLocation",
    description: `Given a partial &#x60;country&#x60;, &#x60;state&#x60;, and/or &#x60;city&#x60; query param, returns
the first matching complete &#x60;LocationSelection&#x60; from photo EXIF data, or
&#x60;null&#x60; if no match is found.
`,
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
        description: `Server error or upstream Immich error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/meta",
    alias: "getApiMeta",
    description: `Discovery endpoint for native/self-hosted clients. Compare &#x60;contractVersion&#x60;
to the version your client was built against. Bump &#x60;contractVersion&#x60; in
OpenAPI &#x60;info.version&#x60; when making contract-breaking JSON changes (even if
the URL stays on &#x60;/api/v1&#x60;). &#x60;apiVersion&#x60; reflects the URL path generation.
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
        description: `Server error or upstream Immich error`,
        schema: ErrorResponse,
      },
      {
        status: 502,
        description: `Server error or upstream Immich error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/settings",
    alias: "getSettingsOverrides",
    description: `Returns the raw user-saved override object. Empty object &#x60;{}&#x60; means no overrides are saved.`,
    requestFormat: "json",
    response: AppSettings,
  },
  {
    method: "put",
    path: "/settings",
    alias: "putSettingsOverrides",
    description: `Replaces the in-memory user overrides with the supplied object. Overrides
are held in server memory and reset on restart. For persistent defaults,
use &#x60;DEFAULT_*&#x60; env vars or URL parameters instead.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AppSettings,
      },
    ],
    response: AppSettings,
    errors: [
      {
        status: 400,
        description: `Bad request — invalid parameters or body`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/settings",
    alias: "deleteSettingsOverrides",
    description: `Removes all in-memory user overrides, reverting to defaults + URL settings.`,
    requestFormat: "json",
    response: z.object({ message: z.string() }).partial().passthrough(),
  },
  {
    method: "get",
    path: "/settings/defaults",
    alias: "getSettingsDefaults",
    description: `Returns the baseline settings built from &#x60;DEFAULT_*&#x60; environment variables, before URL or user overrides are applied.`,
    requestFormat: "json",
    response: AppSettings,
  },
  {
    method: "get",
    path: "/settings/resolved",
    alias: "getSettingsResolved",
    description: `Returns the effective application configuration after merging all sources
in precedence order: hardcoded defaults → &#x60;DEFAULT_*&#x60; env vars → URL
query params → user overrides (saved via &#x60;PUT /settings&#x60;).

The following query params are stripped before URL-settings resolution
and are **not** treated as settings overrides: &#x60;seed&#x60;, &#x60;cursor&#x60;, &#x60;limit&#x60;,
&#x60;filter&#x60;.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "settings (dot-notation)",
        type: "Query",
        schema: z.object({}).partial().passthrough().optional(),
      },
    ],
    response: AppSettings,
    errors: [
      {
        status: 500,
        description: `Server error or upstream Immich error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/slideshow",
    alias: "getSlideshow",
    description: `Returns the full ordered photo list for playback in a single response
(no cursor/limit pagination). Filtering, shuffle, and ordering are applied
server-side using the resolved settings for the request. Fetch
&#x60;/settings/resolved&#x60; in parallel to get configuration.

&#x60;total&#x60; equals the length of &#x60;photos&#x60;. A future paginated API may return
a page in &#x60;photos&#x60; while &#x60;total&#x60; reflects the full filtered set.

**Settings are not included in this response.** Use &#x60;/settings/resolved&#x60;
for configuration.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "seed",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "settings (dot-notation)",
        type: "Query",
        schema: z.object({}).partial().passthrough().optional(),
      },
    ],
    response: SlideshowResponse,
    errors: [
      {
        status: 500,
        description: `Server error or upstream Immich error`,
        schema: ErrorResponse,
      },
      {
        status: 502,
        description: `Server error or upstream Immich error`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/weather",
    alias: "getWeather",
    description: `Returns current weather for the location resolved from settings
(&#x60;weather.location.lat&#x60; / &#x60;weather.location.lng&#x60;). No coordinates are
required from the caller — the server resolves them from the effective
settings (defaults → URL overrides → user overrides).

Returns &#x60;404&#x60; when &#x60;weather.enabled&#x60; is &#x60;false&#x60; in the resolved settings,
or when no location has been configured. Returns &#x60;503&#x60; when the server&#x27;s
&#x60;OWM_KEY&#x60; is not set.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "settings (dot-notation)",
        type: "Query",
        schema: z.object({}).partial().passthrough().optional(),
      },
    ],
    response: WeatherData,
    errors: [
      {
        status: 404,
        description: `Resource not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `Server error or upstream Immich error`,
        schema: ErrorResponse,
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
