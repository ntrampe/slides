# Codebase Architecture & Patterns

**Project:** Slides - Photo slideshow (React + TypeScript + Vite)  
**Stack:** TanStack Query, Tailwind CSS, Lucide Icons

---

## Architecture

**Monorepo** with feature-first web app and isolated server domain:

```
apps/web/src/
├── api/                 # Production fetchers (GET/PUT/DELETE /api/v1)
├── features/[feature]/  # components/, hooks/, types.ts
└── mocks/               # Demo-only fetch interceptor (VITE_USE_MOCK)

apps/server/src/
├── domain/              # Settings, filters, Immich mapping (no HTTP)
├── services/            # Catalog, slideshow, settings, weather
├── http/routes/v1/      # Express routes + validation
└── infra/               # ImmichClient, LinkBuilder

packages/api-contract/   # OpenAPI-generated types + Zod schemas
packages/shared/         # FALLBACK_APP_SETTINGS, errors, utilities
```

**Types:** `@slides/api-contract` is the source of truth for JSON shapes on `/api/v1`. Edit `packages/api-contract/openapi.yaml`, then run `npm run contract:gen`. React re-exports wire types from `features/*/types.ts` when needed for ergonomics.

---

## Core Rules

### Components
- ✅ Presentational only (UI + user interactions)
- ✅ Call **one facade hook** for business logic
- ❌ Never contain business logic
- ❌ Never call services directly
- ❌ Never import DTOs

```tsx
// ✅ GOOD
export const Slideshow = () => {
    const { state, actions } = useSlideshow(); // Single facade hook
    
    if (state.isLoading) return <LoadingView />;
    if (state.isError) return <ErrorView />;
    
    return <PhotoDisplay photo={state.currentPhoto} />;
};
```

### Hooks
- **Facade pattern**: One public hook orchestrates multiple sub-hooks
- **Return grouping**: `{ state, actions, debug? }`
- **Explicit types**: Define `Use[Name]Return` interfaces

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

### API fetchers (`apps/web/src/api/`)
- **Production fetchers** only perform `fetch` via `api/http.ts` — no `VITE_USE_MOCK` branches
- **Demo builds** (`npm run build:demo`): `main.tsx` installs `setupMockFetch()` which intercepts `/api/v1/*` at the network layer
- Immich DTO → contract mapping happens **server-side** in `apps/server/src/domain` and services

```typescript
// ✅ GOOD: thin fetcher + hook (slideshow is the primary data path)
export async function fetchSlideshow(search: string, seed?: string): Promise<SlideshowData> {
    const data = await apiGet<SlideshowResponse>(/* /slideshow + search + seed */);
    return { total: data.total, photos: data.photos.map(revivePhoto) };
}

// useSlideshowData.ts
const { data } = useQuery({
    queryKey: ['slideshow', search, seed],
    queryFn: () => fetchSlideshow(search, seed),
});
```

---

## Theming (Tailwind CSS)

### Semantic Variables (Always Use)

Theme-aware variables defined in CSS, switched via `data-theme` attribute:

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
    <button className="bg-primary-500 hover:bg-primary-600 text-white">
        Save
    </button>
</div>

// ❌ BAD: Hardcoded colors (won't adapt)
<div className="bg-slate-100 border-gray-300 text-gray-900">
    <button className="bg-blue-500 hover:bg-blue-600">Save</button>
</div>
```

**Exception**: Overlays on photos can use `text-white`, `bg-black/20` (always on dark media).

### Theme Hook

```typescript
const { mode, setMode } = useTheme();
// Persists via settings, applies via data-theme attribute
```

---

## State Management

1. **Local UI** → `useState` (transient: hover, focus)
2. **Business logic** → Custom hooks
3. **Server data** → TanStack Query
4. **Global UI** → Context (settings, theme, controls)

```typescript
// TanStack Query pattern
const { data, isLoading } = useQuery({
    queryKey: ['albums'],
    queryFn: () => fetchAlbums(),
});

// Context for cross-cutting UI state (visibility, idle) — not for API wiring
```

---

## Settings Architecture

User overrides are persisted via `PATCH /api/v1/settings/{domain}` (files under `DATA_DIR/settings.{query,playback,display}.json`). Demo builds (`VITE_USE_MOCK=true`) intercept those endpoints and persist per-domain overrides in `localStorage` via `apps/web/src/mocks/settingsStorage.ts`.

**Configuration:** `GET /api/v1/settings` returns effective flat `AppSettings` (defaults → persisted overrides → URL query params). Forward `window.location.search` for kiosk presets. `FALLBACK_APP_SETTINGS` is used only when that request fails. Live sync uses SSE; after a `settings` event the client invalidates `['settings', search]` so URL overrides are re-applied server-side.

**Slideshow data:** `POST /api/v1/slideshow/query` with filter fields + `shuffle` + `seed` in the JSON body. The server is stateless (no kiosk session). Playback index and timers are client-only (keyboard/HUD on each kiosk).

### Adding a New Setting

1. **Update the OpenAPI schema** in `packages/api-contract/openapi.yaml`, then run `npm run contract:gen`.

2. **Add default value** in `apps/server/src/domain/defaultSettings.ts`:

```typescript
export function buildDefaultSettings(): DomainAppSettings {
    return {
        // ... existing flat keys ...
        myFeatureEnabled: parseBool(process.env.DEFAULT_MY_FEATURE_ENABLED, true),
        myFeatureThreshold: parseNumber(process.env.DEFAULT_MY_FEATURE_THRESHOLD, 50),
    };
}
```

3. **Add fallback value** in `packages/shared/src/constants.ts` (`FALLBACK_APP_SETTINGS`, used when server is unavailable):

```typescript
export const FALLBACK_APP_SETTINGS: AppSettings = {
    // ... existing fallbacks ...
    myFeature: {
        enabled: true,
        threshold: 50,
    },
};
```

### Using Settings

**In hooks** (business logic):

```typescript
export function useMyFeature() {
    const { settings } = useSettingsData();
    const { enabled, threshold } = settings.myFeature;
    
    // Use settings in logic
    if (!enabled) return { state: { disabled: true } };
    
    return { state: { threshold, result: calculate(threshold) } };
}
```

**In components** (via facade hook):

```typescript
export const MyComponent = () => {
    const { state } = useMyFeature(); // Settings accessed via facade
    
    if (state.disabled) return null;
    return <div>Threshold: {state.threshold}</div>;
};
```

**Updating settings** (pass only the override slice; do not spread full computed `settings`):

```typescript
const { updateSettings } = useSettingsData();

updateSettings({
    myFeature: { enabled: false, threshold: 75 },
});
```

**Environment variables** (`.env.example`):

```bash
DEFAULT_MY_FEATURE_ENABLED=true
DEFAULT_MY_FEATURE_THRESHOLD=50
```

**Docker deployment** (runtime configuration via environment variables):

```bash
docker run -e DEFAULT_MY_FEATURE_ENABLED=true \
           -e DEFAULT_MY_FEATURE_THRESHOLD=50 \
           slides
```

**Docker Compose**:

```yaml
services:
  slides:
    image: slides
    environment:
      - DEFAULT_MY_FEATURE_ENABLED=true
      - DEFAULT_MY_FEATURE_THRESHOLD=50
```

### Settings Pattern Rules

- ✅ Access via `useSettingsData()` hook
- ✅ Define defaults in `apps/server/src/domain/defaultSettings.ts` using `process.env.DEFAULT_*` vars
- ✅ Provide fallbacks in `@slides/shared/constants` (for server failures)
- ✅ Settings are fetched from server at runtime (allows Docker env var configuration)
- ✅ Environment variables follow `DEFAULT_*` naming convention
- ❌ Never hardcode defaults in components
- ❌ Never access localStorage or environment variables directly
- ❌ Don't use `VITE_*` prefix for settings (those are build-time only)

---

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Component | PascalCase.tsx | `PhotoDisplay.tsx` |
| Hook | use*.ts | `useSlideshow.ts` |
| API fetcher | fetch*.ts in `api/` | `fetchSlideshow.ts` |
| Types | types.ts | Feature-level `types.ts` |
| Hook return | Use[Name]Return | `UseSlideshowReturn` |
| Component props | [Name]Props | `PhotoDisplayProps` |

---

## Quick Patterns

### Keyboard Shortcuts
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

### Slideshow data query
```typescript
const { data } = useQuery({
    queryKey: ['slideshow', search, seed],
    queryFn: () => fetchSlideshow(search, seed),
});
const photos = data?.photos ?? [];
```

### Settings Mutation
```typescript
const mutation = useMutation({
    mutationFn: (s: DeepPartial<AppSettings>) => saveSettingsOverrides(s),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['settings-overrides'] });
        queryClient.invalidateQueries({ queryKey: ['settings-resolved'] });
        queryClient.invalidateQueries({ queryKey: ['slideshow'] });
    },
});
```

---

## Anti-Patterns (Avoid)

- ❌ Logic in components
- ❌ Multiple hooks without facade
- ❌ DTOs leaking into components
- ❌ Hardcoded theme colors in UI chrome
- ❌ `any` types (use interfaces)

---

## Checklist: New Feature

1. Extend `packages/api-contract/openapi.yaml` if the API shape changes; run `npm run contract:gen`
2. Create `apps/web/src/features/[name]/` with `components/`, `hooks/`, `types.ts`
3. Add fetchers in `apps/web/src/api/` if new endpoints are needed
4. Implement server logic in `apps/server/src/domain` + `services/` + `http/routes/v1/`
5. Write data hooks (TanStack Query calling fetchers)
6. Write facade hook
7. Build presentational components
8. Export via `index.ts`

---

## Notes for AI Agents

- **Components = dumb presentational UI** calling facade hooks
- **Hooks = orchestrate logic** via facade pattern; call `apps/web/src/api/*`, not server imports
- **API fetchers = thin `/api/v1` clients** (Immich mapping is server-side only)
- **Theming = semantic CSS variables** (`bg-surface`, not `bg-gray-100`)
- **Types = `@slides/api-contract`** for wire shapes; explicit `Use*Return` for hooks
- Look at `apps/web/src/features/slideshow/` and `apps/web/src/features/settings/hooks/useSettingsData.ts` for reference patterns

**Demo build**: `VITE_USE_MOCK=true` enables `apps/web/src/mocks/setupMockFetch.ts` — extend handlers there, not production fetchers.