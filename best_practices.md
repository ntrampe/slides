# Codebase Architecture & Patterns

**Project:** Slides — photo slideshow (React + TypeScript + Vite)  
**Stack:** TanStack Query, Tailwind CSS, Lucide Icons

This document is the single source of truth for architecture, API patterns, and coding conventions. It is tool-agnostic — point any AI agent or contributor here.

---

## Architecture

npm workspaces monorepo. The **server is the source of truth**; clients are thin playback/UI shells.

```
apps/web/src/
├── api/                 # Thin fetchers → /api/v1 (no business logic)
├── features/[feature]/  # See feature layout below
├── components/          # Shared UI (pickers, HUD chrome)
├── context/             # UI-only context (idle, visibility)
├── hooks/               # Cross-cutting utilities (e.g. useKeyToggle)
└── mocks/               # Demo-only fetch interceptor (VITE_USE_MOCK)

apps/server/src/
├── domain/              # Business rules (no HTTP)
├── services/            # Application orchestration
├── http/routes/v1/      # Express routes + validation
├── http/mappers/        # Domain → contract DTOs
└── infra/               # ImmichClient, LinkBuilder

packages/api-contract/   # OpenAPI → generated types + Zod
packages/shared/         # FALLBACK_APP_SETTINGS, errors, utilities
```

**Feature layout:**

```
apps/web/src/features/[feature]/
├── components/
├── hooks/         # data hooks + optional screen facade
├── context/       # optional — e.g. settings presentation (PresentationSettingsProvider)
├── types.ts
└── index.ts       # public exports only
```

**Types:** `@slides/api-contract` is the source of truth for JSON shapes on `/api/v1`. Edit `packages/api-contract/openapi.yaml`, then run `npm run contract:gen`. React re-exports wire types from `features/*/types.ts` when needed for ergonomics.

### Server owns

- Immich integration and API key (never exposed to browser)
- Photo filtering, exclusions, shuffle (`POST /slideshow/query`)
- Settings merge: env defaults → persisted JSON → URL overrides
- Asset proxying (`/assets/:id/thumbnail|video`)
- Catalog (albums, people, locations), weather
- SSE broadcast of settings changes (`GET /events`)

### Client owns

- Playback engine: index, timer, transitions, keyboard
- Photo preloading ring buffer (`usePhotoPool`)
- UI chrome: theme DOM (`data-theme`), idle/visibility, settings panel
- Presentation settings: theme mode, HUD visibility toggles (`usePresentationSettings` → `localStorage`)
- Stable shuffle `seed` (sent in slideshow query body; not a settings key)

### Thin client boundary

**Server-side only (non-negotiable):**

- Immich API calls, credentials, DTO mapping
- Photo filter/query construction, shuffle ordering
- Settings merge: env → persisted → URL bracket notation
- Parsing URL overrides (client forwards `window.location.search`; never interprets bracket keys)

**Client-side (intentional, not "fat client"):**

- Playback orchestration: index, timer, transitions, keyboard
- Photo preload ring buffer
- Layout heuristics driven by already-fetched data (e.g. split layout for portrait pairs)
- Wire-shape normalization at the fetch boundary (e.g. `revivePhoto` for dates)
- Presentation-only state (`usePresentationSettings`)

**Thin client** means **no business rules on the client**, not **no logic on the client**.

### Multi-client goal

React web today; Flutter/mobile/kiosk later. All clients use the same `/api/v1` contract:

`GET /meta` → `GET /settings` + `GET /events` → `POST /slideshow/query` → local timer/index.

See `README.md` client profiles and `packages/api-contract/openapi.yaml`.

### Where does new code go?

| Change | Location |
|--------|----------|
| New API endpoint or JSON shape | `packages/api-contract/openapi.yaml` → `npm run contract:gen` |
| Business rule / filter logic | `apps/server/src/domain/` |
| Persistence, Immich calls, SSE | `apps/server/src/services/` |
| HTTP route + validation | `apps/server/src/http/routes/v1/` |
| Web fetcher | `apps/web/src/api/` |
| TanStack Query data hook | `apps/web/src/features/[feature]/hooks/` |
| Screen facade hook | `apps/web/src/features/[feature]/hooks/` |
| UI component | `apps/web/src/features/[feature]/components/` |
| Shared UI widget | `apps/web/src/components/` |
| Client-only persisted UI state | `apps/web/src/features/[feature]/context/` (e.g. `features/settings/context/`) |
| Cross-cutting hook utility | `apps/web/src/hooks/` (idle lives in `context/IdleContext.tsx`, re-exported from `hooks/`) |
| Cross-app constant/fallback | `packages/shared/` |

---

## API & Settings

### Contract-first workflow

1. Edit `packages/api-contract/openapi.yaml`
2. Run `npm run contract:gen`
3. Fix types in `apps/server` (mappers, validation) and `apps/web` (fetchers)
4. Bump `info.version` on **every** contract change (breaking or additive)
5. Sync `packages/shared/src/apiVersions.ts` `SLIDES_CONTRACT_VERSION` in the same commit/PR

`GET /meta` returns `contractVersion` — clients rely on it for compatibility checks.

- `SLIDES_API_VERSION` (`"1"`) — URL path segment (`/api/v1`)
- `SLIDES_CONTRACT_VERSION` — tracks OpenAPI `info.version`

Import wire types from `@slides/api-contract`. Server validates requests with generated Zod schemas.

### Endpoints (current — not legacy)

| Operation | Endpoint |
|-----------|----------|
| Contract version | `GET /meta` |
| Effective settings | `GET /settings` (+ forward `window.location.search` for URL overrides) |
| Live settings sync | `GET /events` (SSE) |
| Photo list | `POST /slideshow/query` (JSON body, not GET) |
| Persist settings | `PATCH /settings/{query\|playback\|configuration}` |
| Clear settings | `DELETE /settings` or `DELETE /settings/{domain}` |
| Media | `GET /assets/:id/thumbnail`, `GET /assets/:id/video` |

### Settings domains

`AppSettings` has exactly three keys: `query`, `playback`, `configuration`. Presentation toggles (theme, HUD visibility) live client-side in `usePresentationSettings` (`localStorage`).

**Precedence (server-side):** `FALLBACK_APP_SETTINGS` → `DEFAULT_*` env → persisted JSON (`DATA_DIR/settings.{domain}.json`) → URL bracket notation (session-only, not SSE-broadcast).

**Web fetchers:** `fetchSettings`, `patchQuerySettings`, `patchPlaybackSettings`, `patchConfigurationSettings`, `clear*Settings` in `apps/web/src/api/settings.ts`.

**Web hooks:** `useSettingsData()` returns `updateQuerySettings`, `updatePlaybackSettings`, `updateConfigurationSettings`, `clearSettings`. `usePresentationSettings()` manages client-only presentation state.

### SSE events

Domain-scoped events on `GET /events`: `query_updated`, `playback_updated`, `configuration_updated`, `settings_cleared`.

`useSyncEvents` invalidates TanStack Query caches — do not poll settings.

### Canonical TanStack Query keys

| Data | Query key | Data hook |
|------|-----------|-----------|
| Settings | `['settings', search]` — `staleTime: Infinity` | `useSettingsData` |
| Slideshow photos | `['slideshow-photos', queryBody]` where `queryBody = { ...settings.query, seed }` | `useSlideshowData` |
| Albums / people / locations | `['albums']`, `['people']`, `['locations']` | `useAlbums`, `usePeople`, `useLocationHierarchy` |
| Weather | `['weather', lat, lng]` | `useWeather` |

After query settings change: invalidate `['slideshow-photos']`. After configuration settings change: invalidate `['weather']`.

`fetchWeather()` forwards `window.location.search`; lat/lng in the query key come from `settings.configuration` passed into `useWeather`.

### Slideshow query body

```typescript
const queryBody = { ...settings.query, seed: getSlideshowSeed() };
await querySlideshow(queryBody); // POST /slideshow/query
```

Server returns full ordered list; client manages playback index locally.

---

## Web App Patterns

### Feature-first layout

Cross-feature fetchers live in `apps/web/src/api/` — not in feature `repos/` folders.

Shared UI: `apps/web/src/components/`. UI-only context: `apps/web/src/context/`.

### Public API (`index.ts`)

- Every feature exports its public surface via `index.ts`
- Export hooks, components, and types intended for cross-feature use
- Export shared data hooks (e.g. `useSettingsData` from `features/settings/index.ts`)
- Import from feature barrels (`from '../../settings'`) rather than deep paths where possible

### Components (three tiers)

| Tier | Examples | Hook rule |
|------|----------|-----------|
| **Screen** | `Slideshow`, `SettingsPanel` | One facade hook **or** compose 1–2 focused data hooks if the screen is primarily a form (settings) |
| **Widget** | `SlideshowHUD`, `AlbumPicker`, `PeoplePicker` | Use a **feature data hook** (`useWeather`, `useAlbums`) — never import `api/*` |
| **Leaf** | `PhotoDisplay`, `WeatherDisplay`, `HudButton` | Receive props **or** read a narrow slice via `useSettingsData()` for display config — no `useQuery`, no `api/*` |

**Hard bans (all tiers):**

- Never import `apps/web/src/api/*` from any component
- Never run `useQuery` / `useMutation` in components (belongs in `features/*/hooks/`)
- Never encode filter/settings merge or Immich logic in JSX

**Screen — facade hook:**

```tsx
// ✅ GOOD: screen uses one facade
export const Slideshow = () => {
    const { state, actions } = useSlideshow();

    if (state.isLoading) return <LoadingView />;
    if (state.isError) return <ErrorView />;

    return <PhotoDisplay photo={state.currentPhoto} photoScaleMode={state.photoScaleMode} />;
};
```

**Widget — data hook (never api/* directly):**

```tsx
// ✅ GOOD: widget uses a feature data hook
export const SlideshowHUD = (props: SlideshowHUDProps) => {
    const { presentation } = usePresentationSettings();
    const { data: weather } = useWeather({ enabled: presentation.showWeather });
    // ...
};
```

**Leaf — props preferred:**

```tsx
// ✅ GOOD: leaf receives data via props (preferred)
export const PhotoDisplay = ({ photo, photoScaleMode }: PhotoDisplayProps) => { /* ... */ };

// ✅ ACCEPTABLE: leaf reads a narrow settings slice for display config
export const PhotoDisplay = ({ photo }: { photo: Photo }) => {
    const { settings } = useSettingsData();
    const photoScaleMode = settings.playback.photoScaleMode;
    // ...
};
```

### Hooks

#### Data hooks

One per remote resource or query key. Call fetchers from `apps/web/src/api/`; wrap TanStack Query. Named `use[Resource]`. Return query result shape or a thin wrapper — `{ state, actions }` is not required.

| Hook | Query key | Fetcher |
|------|-----------|---------|
| `useSettingsData` | `['settings', search]` | `fetchSettings` |
| `useSlideshowData` | `['slideshow-photos', queryBody]` | `querySlideshow` |
| `useAlbums` | `['albums']` | `fetchAlbums` |
| `usePeople` | `['people']` | `fetchPeople` |
| `useLocationHierarchy` | `['locations']` | `fetchLocationHierarchy` |
| `useWeather` | `['weather', lat, lng]` | `fetchWeather` |

Reference: `apps/web/src/features/settings/hooks/useSettingsData.ts`

`useSettingsData` is a **shared data hook** — used by facades, widgets, and occasionally leaves. It is not a screen facade.

#### Facade hooks

One per **screen** that orchestrates multiple sub-hooks. Return `{ state, actions, debug? }` with explicit `Use[Name]Return` type.

Reference: `apps/web/src/features/slideshow/hooks/useSlideshow.ts`

```typescript
export function useSlideshow(): UseSlideshowReturn {
    const data = useSlideshowData();
    const timer = useSlideshowTimer();

    return {
        state: { currentPhoto, isPlaying, progress },
        actions: { goToNext, togglePlayPause },
        debug: settings.debug ? { poolStats } : undefined
    };
}
```

`useSettingsPanel` is a **UI-state facade** (panel open/close), distinct from `useSettingsData`.

#### Action hooks

Hooks that orchestrate side effects without TanStack Query may use `{ state, actions }`. Reference: `apps/web/src/features/settings/hooks/useWeatherCurrentLocation.ts`.

`useSyncEvents` — SSE invalidation (mounted in `App.tsx`); not a data or facade hook.

### API fetchers (`apps/web/src/api/`)

- **Production fetchers** only perform `fetch` via `api/http.ts` — no `VITE_USE_MOCK` branches
- **Demo builds** (`npm run build:demo`): `main.tsx` installs `setupMockFetch()` which intercepts `/api/v1/*` at the network layer
- Immich DTO → contract mapping happens **server-side** in `apps/server/src/domain` and services

```typescript
// ✅ GOOD: thin fetcher + data hook (slideshow is the primary data path)
export async function querySlideshow(body: SlideshowQueryRequest): Promise<SlideshowData> {
    const data = await apiPost<SlideshowResponse>('/slideshow/query', body);
    return { total: data.total, photos: data.photos.map(revivePhoto) };
}

// useSlideshowData.ts
const queryBody = { ...settings.query, seed: getSlideshowSeed() };
const { data } = useQuery({
    queryKey: ['slideshow-photos', queryBody],
    queryFn: () => querySlideshow(queryBody),
});
```

### Demo mode

`VITE_USE_MOCK=true` installs `setupMockFetch()` in `main.tsx`. Extend `apps/web/src/mocks/handlers.ts` — never add mock branches to production fetchers.

---

## Theming (Tailwind CSS)

Theme applied via `data-theme` attribute. Semantic Tailwind variables — never hardcoded colors in UI chrome.

| Use Case | Class | Notes |
|----------|-------|-------|
| Backgrounds | `bg-background`, `bg-surface` | Main + elevated surfaces |
| Text | `text-text-primary`, `text-text-secondary` | Primary + muted |
| Borders | `border-border` | Default borders |
| Actions | `bg-primary-500`, `hover:bg-primary-600` | Primary buttons |
| Status | `text-success`, `text-error`, `text-warning` | Semantic colors |

```tsx
// ✅ GOOD: Theme-aware
<div className="bg-surface border border-border text-text-primary">
    <button className="bg-primary-500 hover:bg-primary-600 text-white">Save</button>
</div>

// ❌ BAD: Hardcoded colors (won't adapt)
<div className="bg-slate-100 border-gray-300 text-gray-900">
    <button className="bg-blue-500 hover:bg-blue-600">Save</button>
</div>

// ❌ BAD: Raw palette status colors in settings chrome
<span className="text-yellow-400">Warning</span>
<span className="text-red-500">Error</span>
// Use text-warning, text-error instead
```

**Exception**: Overlays on photos can use `text-white`, `bg-black/20` (always on dark media).

```typescript
const { mode, setMode } = useTheme();
// Persists via usePresentationSettings (localStorage), applies via data-theme attribute
```

---

## State Management

1. **Local UI** → `useState` (transient: hover, focus)
2. **Business logic** → Custom hooks (data hooks, facades, action hooks)
3. **Server data** → TanStack Query (`useSettingsData`, catalog, slideshow, weather)
4. **Global UI** → Context (visibility, idle) and `usePresentationSettings` (theme, HUD toggles)

Data hooks may be shared across features; facades are screen-scoped.

```typescript
const { data, isLoading } = useQuery({
    queryKey: ['albums'],
    queryFn: () => fetchAlbums(),
});
```

---

## Settings Architecture

Server settings persist via `PATCH /api/v1/settings/{domain}` (files under `DATA_DIR/settings.{query,playback,configuration}.json`). Presentation toggles persist client-side via `usePresentationSettings` (`localStorage`). Demo builds intercept server settings endpoints and persist per-domain overrides in `localStorage` via `apps/web/src/mocks/settingsStorage.ts`.

**Configuration:** `GET /api/v1/settings` returns effective nested `AppSettings` (defaults → persisted overrides → URL query params). Forward `window.location.search` for kiosk presets. `FALLBACK_APP_SETTINGS` is used only when that request fails. Live sync uses SSE; `useSyncEvents` invalidates `['settings', search]` on domain events.

**Slideshow data:** `POST /api/v1/slideshow/query` with `settings.query` fields + `seed` in the JSON body. The server is stateless. Playback index and timers are client-only.

### Adding a new setting

1. Add to correct domain schema in `openapi.yaml` → `contract:gen`
2. Map `DEFAULT_*` in `apps/server/src/domain/defaultSettings.ts`
3. Add fallback in `packages/shared/src/constants.ts` (`FALLBACK_APP_SETTINGS`)
4. Document env var in `.env.example`

```typescript
// defaultSettings.ts — nested under the correct domain
export function buildDefaultSettings(): DomainAppSettings {
    const fallback = FALLBACK_APP_SETTINGS;
    return {
        playback: {
            // ...existing keys...
            myFeatureEnabled: parseBool(
                process.env.DEFAULT_MY_FEATURE_ENABLED,
                fallback.playback.myFeatureEnabled
            ),
        },
    };
}
```

### Using and updating settings

```typescript
// In hooks
const { settings } = useSettingsData();
const { myFeatureEnabled } = settings.playback;

// Updating (pass only changed fields for the domain)
const { updatePlaybackSettings } = useSettingsData();
updatePlaybackSettings({ myFeatureEnabled: false });
```

### Settings pattern rules

- ✅ Access server settings via `useSettingsData()`; presentation toggles via `usePresentationSettings()`
- ✅ Define defaults in `defaultSettings.ts` using `process.env.DEFAULT_*` vars
- ✅ Provide fallbacks in `@slides/shared/constants`
- ✅ Environment variables follow `DEFAULT_*` naming convention
- ❌ Never hardcode defaults in components
- ❌ Never access localStorage for server settings
- ❌ Don't use `VITE_*` prefix for settings (build-time only)

---

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Component | PascalCase.tsx | `PhotoDisplay.tsx` |
| Data hook | use*.ts | `useWeather.ts`, `useSettingsData.ts` |
| Facade hook | use*.ts | `useSlideshow.ts` |
| API fetcher | `api/*.ts` | `slideshow.ts` (`querySlideshow`) |
| Types | types.ts | Feature-level `types.ts` |
| Hook return | Use[Name]Return | `UseSlideshowReturn` |
| Component props | [Name]Props | `PhotoDisplayProps` |

---

## Quick Patterns

### Keyboard shortcuts

```typescript
export function useSlideshowKeyboard({ onNext, onPrevious }: Options) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrevious();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onNext, onPrevious]);
}
```

### Settings mutation

```typescript
const { updateQuerySettings } = useSettingsData();
updateQuerySettings({ shuffle: false });
// useSettingsData invalidates ['slideshow-photos'] on query domain success
// useSyncEvents also invalidates caches when SSE events arrive from other clients
```

---

## Anti-Patterns (Avoid)

- ❌ Business logic in components (filtering, settings merge, Immich query building)
- ❌ `useQuery` / `useMutation` in components (move to a data hook in `features/*/hooks/`)
- ❌ `api/*` imports in components (move to a data hook)
- ❌ DTOs leaking into components
- ❌ Hardcoded theme colors in UI chrome (including raw palette status colors like `text-yellow-400`, `text-red-500`)
- ❌ `any` types (use interfaces)
- ❌ Feature-level `repos/` or `services/` folders (use `apps/web/src/api/`)
- ❌ `fetchSlideshow` via GET or `updateSettings` flat mutation
- ❌ Parsing URL settings on the client (forward `window.location.search` to server)
- ❌ Put Immich query building, settings merge, or URL override parsing in the web app
- ❌ Poll settings (use SSE via `useSyncEvents`)
- ❌ Use `GET /slideshow` or `PUT /settings` (use `POST /slideshow/query` and `PATCH /settings/{domain}`)
- ❌ Add `VITE_USE_MOCK` branches in production fetchers (mock at network layer in `apps/web/src/mocks/`)

---

## Checklist: New Feature

1. Extend `packages/api-contract/openapi.yaml` if the API shape changes; run `npm run contract:gen`; sync `SLIDES_CONTRACT_VERSION`
2. Implement server logic in `apps/server/src/domain` + `services/` + `http/routes/v1/`
3. Add fetchers in `apps/web/src/api/` if new endpoints are needed
4. Create `apps/web/src/features/[name]/` with `components/`, `hooks/`, `types.ts`
5. Write **data hook** in `features/[name]/hooks/` (TanStack Query calling fetchers)
6. Write **facade hook** if the feature has a screen-level orchestrator (skip for simple catalog pickers)
7. Build components (tier-appropriate hook usage)
8. Export via `index.ts`

---

## Notes for AI Agents

- **This file** is the complete architecture and pattern reference for this repo
- **Thin client** = server owns rules; client owns playback and presentation
- **Screens** → facade hook; **widgets** → data hooks; **leaves** → props preferred
- Never `api/*` or TanStack Query in components
- `useSettingsData` is a shared data hook, not a screen facade
- **API fetchers** = thin `/api/v1` clients (Immich mapping is server-side only)
- **Theming** = semantic CSS variables (`bg-surface`, not `bg-gray-100`)
- **Types** = `@slides/api-contract` for wire shapes; explicit `Use*Return` for facade/action hooks
- **Reference implementations:** `features/slideshow/` (facade), `features/settings/hooks/useSettingsData.ts` (data hook), `features/settings/hooks/useWeatherCurrentLocation.ts` (action hook)
- **Demo build:** `VITE_USE_MOCK=true` → extend `apps/web/src/mocks/handlers.ts`, not production fetchers
