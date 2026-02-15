# Codebase Architecture & Best Practices

> **Project:** Immich Slides - Photo slideshow application with React + TypeScript + Vite
> 
> **Tech Stack:** React 19, TypeScript, TanStack Query, Tailwind CSS 4, Lucide Icons
>
> **Last Updated:** [Current Date]

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Folder Structure](#folder-structure)
3. [Naming Conventions](#naming-conventions)
4. [Component Patterns](#component-patterns)
5. [Theme Patterns](#theme-patterns)
6. [Hook Patterns](#hook-patterns)
7. [Service Layer](#service-layer)
8. [Type System](#type-system)
9. [State Management](#state-management)
10. [Testing Approach](#testing-approach)
11. [Common Patterns](#common-patterns)

---

## Architecture Overview

This codebase follows a **feature-first architecture** with clear separation of concerns:

```
src/
├── features/          # Feature modules (photos, slideshow, settings, etc.)
├── shared/            # Shared utilities, components, hooks
│   ├── components/
│   ├── context/
│   ├── hooks/
│   └── types/
└── server/            # Express proxy server for Immich API
```

### Core Principles

1. **Feature-first organization**: Each feature is self-contained
2. **Separation of concerns**: UI, logic, data fetching are in separate layers
3. **Dependency injection**: Services injected via Context
4. **Explicit over implicit**: Clear naming, typed interfaces, no magic

---

## Folder Structure

### Feature Module Structure

```
features/[feature-name]/
├── components/        # UI components (presentational)
├── hooks/            # Business logic hooks
│   ├── index.ts      # Public exports
│   └── types.ts      # Hook return types (optional)
├── repos/            # Data repositories (API adapters)
├── services/         # Services (localStorage, external APIs)
├── utils/            # Pure utility functions (rare)
├── types.ts          # Domain types, interfaces
└── index.ts          # Public API exports
```

### Example: `features/slideshow/`

```
slideshow/
├── components/
│   ├── Slideshow.tsx          # Main component (presentational)
│   └── Overlay.tsx            # Sub-component
├── hooks/
│   ├── useSlideshow.ts        # Facade hook (orchestrator)
│   ├── useSlideshowData.ts    # Data fetching layer
│   ├── useSlideshowTimer.ts   # Timer/autoplay logic
│   ├── useSlideshowKeyboard.ts # Keyboard navigation
│   ├── types.ts               # Return type interfaces
│   └── index.ts               # Exports
└── index.ts                   # Public: export Slideshow component
```

---

## Naming Conventions

### Files

| Type | Pattern | Example |
|------|---------|---------|
| Component | `PascalCase.tsx` | `PhotoDisplay.tsx` |
| Hook | `use*.ts` | `useSlideshow.ts` |
| Service/Repo | `*Service.ts`, `*Repo.ts` | `LocalStorageSettingsService.ts` |
| Util | `camelCase.ts` | `shuffle.ts` |
| Types | `types.ts` | `types.ts` (per feature) |
| Context | `*Context.tsx` | `ControlsContext.tsx` |

### Variables & Functions

| Type | Pattern | Example |
|------|---------|---------|
| Component | PascalCase | `PhotoDisplay` |
| Hook | camelCase starting with `use` | `useSlideshow` |
| Function | camelCase | `goToNext`, `togglePlayPause` |
| Interface | PascalCase | `UseSlideshowReturn` |
| Type | PascalCase | `ObjectFit`, `LayoutMode` |
| Service/Repo | PascalCase | `ImmichPhotoRepo` |

### Interface Naming

- **Hook Return Types**: `Use[HookName]Return`
  - Example: `UseSlideshowReturn`, `UseSlideshowDataReturn`
  
- **Hook Options**: `Use[HookName]Options`
  - Example: `UseSlideshowTimerOptions`

- **Component Props**: `[ComponentName]Props`
  - Example: `PhotoMetadataOverlayProps`

- **Services**: `[Domain]Service` interface, `*[Domain]Service` class
  - Example: `WeatherService` (interface), `OWMWeatherService` (class)

- **Repositories**: `[Domain]Repo` interface, `*[Domain]Repo` class
  - Example: `PhotoRepo` (interface), `ImmichPhotoRepo` (class)

---

## Component Patterns

### Rule: Components are Presentational

Components should:
- ✅ Render UI based on props
- ✅ Handle user interactions (click, hover)
- ✅ Manage local UI state (open/closed, focus)
- ✅ Call hooks for business logic
- ❌ **Never** contain business logic
- ❌ **Never** call services directly
- ❌ **Never** import DTOs (API response shapes)

### Pattern: Single Hook Facade

```tsx
// ✅ GOOD: Component calls one facade hook
export const Slideshow = () => {
    const { settings } = useSettingsData();
    const { state, actions, debug } = useSlideshow();

    if (state.isLoading) return <LoadingView />;
    if (state.isError) return <ErrorView />;
    if (!state.currentPhoto) return <LoadingPhotoView />;

    return (
        <div className="relative h-full w-full bg-black overflow-hidden">
            <Overlay progress={state.progress} />
            <PhotoDisplay photo={state.currentPhoto} objectFit={settings.photo.fit} />
            <button onClick={actions.goToNext}>Next</button>
        </div>
    );
};
```

### Pattern: Grouped Return Values

Hook returns are grouped logically:

```tsx
const { state, actions, debug } = useSlideshow();

// state: read-only values
state.currentPhoto
state.isPlaying
state.progress

// actions: user-triggered functions
actions.goToNext()
actions.togglePlayPause()

// debug: optional debug info (conditional)
debug?.poolStats
```

### Pattern: Conditional Rendering

Use early returns for loading/error states:

```tsx
export const Slideshow = () => {
    const { state, actions } = useSlideshow();

    if (state.isLoading) {
        return <div>Loading metadata...</div>;
    }

    if (state.isError) {
        return <div>Something went wrong.</div>;
    }

    if (!state.currentPhoto) {
        return <div>Loading photo...</div>;
    }

    // Main render
    return <div>...</div>;
};
```

---

## Theme System & Styling Best Practices

### Architecture Overview

This project uses **Tailwind CSS v4** with a **CSS-based semantic theming system**. Themes are defined using CSS custom properties and switched via a `data-theme` attribute on the root element.

### Theme Structure

```
src/features/theme/
├── components/
│   └── ThemeSelector.tsx     # UI for theme switching
├── hooks/
│   ├── useTheme.ts           # Main theme hook
│   ├── types.ts              # Hook return types
│   └── index.ts              # Exports
├── types.ts                  # ThemeMode type
└── index.ts                  # Public API
```

### Theme Configuration (CSS)

Themes are defined in `src/index.css` using Tailwind v4's `@theme` directive:

```css
@theme {
    /* Semantic color tokens mapped to theme-aware variables */
    --color-background: var(--bg-default);
    --color-surface: var(--surface-default);
    --color-surface-hover: var(--surface-hover-default);

    --color-text-primary: var(--text-primary-default);
    --color-text-secondary: var(--text-secondary-default);
    --color-text-tertiary: var(--text-tertiary-default);
    --color-text-inverse: var(--text-inverse-default);

    --color-primary-500: var(--primary-500-default);
    --color-primary-600: var(--primary-600-default);

    --color-border: var(--border-default);
    --color-success: var(--success-default);
    --color-warning: var(--warning-default);
    --color-error: var(--error-default);
    --color-info: var(--info-default);
}

/* Light Theme */
:root[data-theme="light"] {
    --bg-default: #ffffff;
    --surface-default: #f8fafc;
    --text-primary-default: #0f172a;
    /* ... */
}

/* Dark Theme */
:root[data-theme="dark"] {
    --bg-default: #0f172a;
    --surface-default: #1e293b;
    --text-primary-default: #f8fafc;
    /* ... */
}
```

---

## Semantic Theme Variables

### ✅ Always Use Semantic Variables

Use semantic theme variables that adapt to the current theme automatically:

| Category | Variable | Usage |
|----------|----------|-------|
| **Background** | `bg-background` | Main app background |
| **Surface** | `bg-surface` | Cards, panels, elevated surfaces |
| **Surface Hover** | `bg-surface-hover` | Hover state for surfaces |
| **Text** | `text-text-primary` | Primary text color |
| | `text-text-secondary` | Secondary/muted text |
| | `text-text-tertiary` | Disabled/placeholder text |
| | `text-text-inverse` | Text on dark backgrounds (white in both themes) |
| **Primary** | `bg-primary-500` | Primary action color |
| | `bg-primary-600` | Primary action hover/active |
| **Borders** | `border-border` | Default border color |
| **Status** | `text-success`, `bg-success` | Success states |
| | `text-warning`, `bg-warning` | Warning states |
| | `text-error`, `bg-error` | Error states |
| | `text-info`, `bg-info` | Informational states |

### Pattern: Semantic Styling

```tsx
// ✅ GOOD: Use semantic variables
export const SettingsPanel = () => {
    return (
        <div className="bg-surface border border-border text-text-primary p-4 rounded-lg">
            <h2 className="text-text-primary font-bold mb-4">Settings</h2>
            <p className="text-text-secondary">Configure your preferences</p>
            
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded">
                Save
            </button>
            
            <input 
                className="bg-surface border border-border text-text-primary p-2 rounded"
                placeholder="Enter value..."
            />
        </div>
    );
};
```

### Anti-Pattern: Hardcoded Colors

```tsx
// ❌ BAD: Hardcoded Tailwind colors (won't adapt to theme)
export const SettingsPanel = () => {
    return (
        <div className="bg-slate-100 border border-gray-300 text-gray-900">
            <h2 className="text-slate-900 font-bold">Settings</h2>
            <p className="text-gray-600">Configure your preferences</p>
            
            <button className="bg-blue-500 hover:bg-blue-600 text-white">
                Save
            </button>
        </div>
    );
};

// ❌ BAD: Inline hex colors
export const Card = () => {
    return (
        <div style={{ backgroundColor: '#f8fafc', color: '#0f172a' }}>
            Content
        </div>
    );
};
```

---

## Theme Hook Pattern

### Pattern: Using the Theme Hook

```tsx
import { useTheme } from '@/features/theme';

export const ThemeToggle = () => {
    const { mode, setMode } = useTheme();
    
    return (
        <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
            {mode === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
    );
};
```

### Implementation Details

The `useTheme` hook:
- ✅ Delegates persistence to settings system (no duplicate storage)
- ✅ Applies theme by setting `data-theme` attribute on `<html>`
- ✅ CSS handles all color changes automatically
- ✅ No runtime JavaScript color calculations

```typescript
// features/theme/hooks/useTheme.ts
export function useTheme(): UseThemeReturn {
    const { settings, updateSettings } = useSettingsData();
    const mode = settings.theme.mode;

    // Apply theme to DOM
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', mode);
    }, [mode]);

    const setMode = useCallback((newMode: ThemeMode) => {
        updateSettings({
            ...settings,
            theme: { mode: newMode },
        });
    }, [settings, updateSettings]);

    return { mode, setMode };
}
```

---

## Special Cases: Overlay Components

### Pattern: Overlay on Photos (Context-Specific)

Some components (like slideshow overlays) need specific styling that works on dark photo backgrounds, independent of theme mode:

```tsx
// ✅ ACCEPTABLE: Overlay on photos (always dark background)
export const PhotoMetadataOverlay = ({ photo }: PhotoMetadataOverlayProps) => {
    return (
        <div className="absolute bottom-6 left-6 bg-black/20 backdrop-blur-md border border-white/5 text-white">
            <div className="text-sm opacity-90">{photo.location}</div>
            <div className="text-xs opacity-70">{photo.date}</div>
        </div>
    );
};

// ✅ ACCEPTABLE: Slideshow controls (always on photos)
export const SlideshowControls = () => {
    return (
        <button className="text-white hover:bg-white/20 rounded-full p-2">
            <Play size={24} />
        </button>
    );
};
```

**Rule**: Only use `text-white`, `bg-black`, etc. when the component is **always** displayed over photos/media, not when it's part of the UI chrome.

### Pattern: Settings/UI Chrome

Settings panels, forms, and UI chrome should **always** use semantic variables:

```tsx
// ✅ GOOD: Settings UI adapts to theme
export const SettingsForm = () => {
    return (
        <div className="bg-surface p-8">
            <h3 className="text-text-primary font-semibold mb-3 border-b border-border pb-2">
                Display Settings
            </h3>
            
            <input 
                className="bg-surface border border-border text-text-primary w-full p-2 rounded"
                type="text"
            />
            
            <div className="text-text-secondary text-sm mt-2">
                Adjust how content is displayed
            </div>
        </div>
    );
};
```

---

## Component Styling Checklist

When creating or updating components, ensure:

- [ ] **Background**: Use `bg-background` or `bg-surface` (not `bg-white`, `bg-gray-100`)
- [ ] **Text**: Use `text-text-primary`, `text-text-secondary` (not `text-gray-900`, `text-slate-600`)
- [ ] **Borders**: Use `border-border` (not `border-gray-300`)
- [ ] **Hover States**: Use `hover:bg-surface-hover` (not `hover:bg-gray-200`)
- [ ] **Buttons**: Use `bg-primary-500` for primary actions (not `bg-blue-500`)
- [ ] **Forms**: Use semantic variables for inputs, selects, textareas
- [ ] **Status Colors**: Use `text-success`, `text-error`, etc. for semantic meaning
- [ ] **Exception**: Only use hardcoded colors for overlays on photos/media

---

## Adding New Theme Variables

If you need a new semantic variable:

1. **Add to `@theme` in `src/index.css`**:
   ```css
   @theme {
       --color-accent: var(--accent-default);
   }
   ```

2. **Define in both theme modes**:
   ```css
   :root[data-theme="light"] {
       --accent-default: #f59e0b;
   }

   :root[data-theme="dark"] {
       --accent-default: #fbbf24;
   }
   ```

3. **Document in this guide**

4. **Use in components**: `bg-accent`, `text-accent`, `border-accent`

---

## Quick Reference: Common Patterns

### Form Elements

```tsx
<input 
    className="bg-surface border border-border text-text-primary p-2 rounded"
    placeholder="Placeholder text"
/>

<select className="bg-surface border border-border text-text-primary p-2 rounded">
    <option>Option 1</option>
</select>

<textarea className="bg-surface border border-border text-text-primary p-2 rounded" />
```

### Buttons

```tsx
// Primary action
<button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded">
    Save
</button>

// Secondary action
<button className="bg-surface hover:bg-surface-hover border border-border text-text-primary px-4 py-2 rounded">
    Cancel
</button>
```

### Cards/Panels

```tsx
<div className="bg-surface border border-border rounded-lg p-4">
    <h3 className="text-text-primary font-semibold mb-2">Title</h3>
    <p className="text-text-secondary text-sm">Description</p>
</div>
```

### Lists

```tsx
<div className="bg-surface border border-border rounded">
    {items.map(item => (
        <div 
            key={item.id}
            className="p-2 hover:bg-surface-hover border-b border-border last:border-b-0"
        >
            <span className="text-text-primary">{item.label}</span>
        </div>
    ))}
</div>
```

---

## Testing Theme Support

When implementing a component, manually test:

1. **Light mode**: Does it look good with light backgrounds?
2. **Dark mode**: Does it look good with dark backgrounds?
3. **Transitions**: Does switching themes feel smooth?
4. **Contrast**: Is text readable in both themes?

Use the theme toggle in Settings to verify both modes.

---

## Notes for AI Coding Agents

When working with styling:

1. **Always use semantic theme variables** (`text-text-primary`, `bg-surface`, etc.)
2. **Never use hardcoded Tailwind colors** (`text-gray-900`, `bg-slate-100`) in UI chrome
3. **Exception**: Overlays on photos can use `text-white`, `bg-black/20` since they're always on dark media
4. **Check existing components** for patterns (e.g., `SettingsPanel`, `ThemeSelector`)
5. **When in doubt**, use semantic variables—they'll adapt correctly
6. **Don't create inline styles** with hex colors—use Tailwind classes
7. **Test both themes** conceptually when suggesting changes

---

## Hook Patterns

### Pattern: Facade Hook

A facade hook orchestrates multiple sub-hooks and exposes a clean API:

```typescript
// features/slideshow/hooks/useSlideshow.ts
export function useSlideshow(): UseSlideshowReturn {
    const { settings } = useSettingsData();
    const { areControlsVisible } = useControls();

    // Sub-hooks
    const data = useSlideshowData({ /* ... */ });
    const timer = useSlideshowTimer({ /* ... */ });

    // Coordination logic
    const handleNext = useCallback(() => {
        data.goToNext();
        timer.reset();
    }, [data, timer]);

    // Keyboard handler
    useSlideshowKeyboard({
        onNext: handleNext,
        onTogglePlayPause: timer.togglePlayPause,
    });

    // Return clean API
    return {
        state: {
            currentPhoto: data.currentLoaded?.photo,
            isPlaying: timer.isPlaying,
            progress: timer.progress,
            areControlsVisible,
        },
        actions: {
            goToNext: handleNext,
            togglePlayPause: timer.togglePlayPause,
        },
        debug: settings.debug.showDebugStats ? { /* ... */ } : undefined,
    };
}
```

### Pattern: Explicit Return Types

Always define return types for non-trivial hooks:

```typescript
// types.ts
export interface UseSlideshowReturn {
    state: {
        currentPhoto: Photo | undefined;
        isPlaying: boolean;
        progress: number;
        areControlsVisible: boolean;
    };
    actions: {
        goToNext: () => void;
        togglePlayPause: () => void;
    };
    debug?: SlideshowDebugInfo;
}

// useSlideshow.ts
export function useSlideshow(): UseSlideshowReturn {
    // ...
}
```

### Pattern: Data Fetching Hooks

Use TanStack Query for API calls:

```typescript
export function usePhotos(params: UsePhotosParams = {}) {
    const { photos: photoRepo } = useServices();
    const { albumIds, personIds, page = 1, pageSize = 100 } = params;

    return useQuery({
        queryKey: ['photos', { albumIds, personIds, page, pageSize }],
        queryFn: () => photoRepo.getPhotos({ albumIds, personIds, page, pageSize }),
        refetchInterval: 60 * 60 * 1000, // 1 hour
    });
}
```

### Pattern: Infinite Query with Flattening

For pagination, flatten pages into a single array:

```typescript
export function useInfinitePhotosFlattened(params: UseInfinitePhotosFlattenedParams = {}) {
    const query = useInfinitePhotos(params);

    const allPhotos = useMemo<Photo[]>(() => {
        if (!query.data) return [];
        return query.data.pages.flatMap(page => page.photos);
    }, [query.data]);

    return {
        ...query,
        photos: allPhotos,
        totalFetched: allPhotos.length,
    };
}
```

### Pattern: Settings Hook (Mutation + Query)

```typescript
export function useSettingsData() {
    const { settings: service } = useServices();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['settings'],
        queryFn: () => service.loadSettings(),
    });

    const mutation = useMutation({
        mutationFn: (newSettings: AppSettings) => service.saveSettings(newSettings),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
    });

    return {
        settings: query.data ?? defaultSettings,
        updateSettings: mutation.mutate,
    };
}
```

---

## Service Layer

### Pattern: Repository Pattern

Repositories abstract API calls. Define an interface, implement multiple versions:

```typescript
// types.ts
export interface PhotoRepo {
    getPhotos: (params: PaginationParams) => Promise<PaginatedPhotos>;
}

// ImmichPhotoRepo.ts
export class ImmichPhotoRepo implements PhotoRepo {
    private proxyUrl = "/immich";

    async getPhotos(params: PaginationParams = {}): Promise<PaginatedPhotos> {
        const res = await fetch(`${this.proxyUrl}/api/search/metadata`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(searchBody),
        });

        // Map API response to domain model
        const photos = assets.map((asset: any) => ({
            id: asset.id,
            url: `${this.proxyUrl}/api/assets/${asset.id}/thumbnail?size=preview`,
            createdAt: new Date(asset.fileCreatedAt ?? asset.createdAt),
            location: asset.exifInfo?.city ?? "Unknown",
        }));

        return { photos, page, pageSize, hasMore: assets.length === pageSize };
    }
}

// MockPhotoRepo.ts
export class MockPhotoRepo implements PhotoRepo {
    private allPhotos: Photo[] = generateMockPhotos(500);

    async getPhotos(params: PaginationParams = {}): Promise<PaginatedPhotos> {
        // Return mock data
    }
}
```

### Pattern: Service Context

All services are injected via context:

```typescript
// ServiceContext.ts
export type AppServices = {
    photos: PhotoRepo;
    weather: WeatherService;
    settings: SettingsService;
    people: PeopleRepo;
};

const isMock = import.meta.env.VITE_USE_MOCK === 'true';

export const services: AppServices = isMock ? mockServices : liveServices;
export const ServiceContext = createContext<AppServices | null>(null);

export const useServices = () => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error("useServices must be used within a ServiceContext.Provider");
    }
    return context;
};
```

### Pattern: DTO to Domain Mapping

**Always map DTOs to domain models in repositories:**

```typescript
// ❌ BAD: Expose API shape directly
return json.assets;

// ✅ GOOD: Map to stable domain model
const photos = assets.map((asset: any) => ({
    id: asset.id,
    url: `${this.proxyUrl}/api/assets/${asset.id}/thumbnail?size=preview`,
    createdAt: new Date(asset.fileCreatedAt ?? asset.createdAt),
    location: asset.exifInfo?.city ?? asset.exifInfo?.state ?? "Unknown",
    description: asset.exifInfo?.description,
}));
```

---

## Type System

### Domain Types (Stable)

Define domain types in `features/[name]/types.ts`:

```typescript
// features/photos/types.ts
export interface Photo {
    id: string;
    url: string;
    location?: string;
    createdAt: Date;
    description?: string;
}
```

### Shared Types (Cross-feature)

Put shared types in `shared/types/`:

```typescript
// shared/types/config.ts
export type ObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
export type LayoutMode = 'single' | 'split';

export interface SlideshowFilter {
    albumIds?: string[];
    personIds?: string[];
}
```

### Type Exports

Use barrel exports for public APIs:

```typescript
// features/slideshow/hooks/index.ts
export { useSlideshow } from './useSlideshow';
export { useSlideshowData } from './useSlideshowData';
export { useSlideshowTimer } from './useSlideshowTimer';
export type * from './types'; // Export all types
```

### Avoid `any`

Always prefer typed interfaces over `any`:

```typescript
// ❌ BAD
export const WeatherDisplay = ({ temp, condition, city }: any) => {

// ✅ GOOD
interface WeatherDisplayProps {
    temp: number;
    condition: WeatherCondition;
    city: string;
}
export const WeatherDisplay = ({ temp, condition, city }: WeatherDisplayProps) => {
```

---

## State Management

### Hierarchy of State

1. **Local UI state** → `useState` in component
   - Transient UI state (hover, focus, open/closed)
   
2. **Feature state** → Custom hooks
   - Business logic, derived state
   
3. **Server state** → TanStack Query
   - API data, caching, revalidation
   
4. **Global UI state** → Context
   - Settings, controls visibility, theme

### Pattern: Context for Global UI State

```typescript
// ControlsContext.tsx
interface ControlsContextValue {
    areControlsVisible: boolean;
    showControls: () => void;
    hideControls: () => void;
}

export const ControlsProvider = ({ children, autoHideDelay = 3000 }) => {
    const [areControlsVisible, setAreControlsVisible] = useState(true);

    const showControls = useCallback(() => {
        setAreControlsVisible(true);
        // Auto-hide after delay
    }, []);

    return (
        <ControlsContext.Provider value={{ areControlsVisible, showControls, hideControls }}>
            {children}
        </ControlsContext.Provider>
    );
};

export const useControls = () => {
    const context = useContext(ControlsContext);
    if (!context) throw new Error('useControls must be used within ControlsProvider');
    return context;
};
```

### Pattern: TanStack Query for Server State

```typescript
// Always use query keys with params
return useQuery({
    queryKey: ['photos', { albumIds, personIds, page, pageSize }],
    queryFn: () => photoRepo.getPhotos({ albumIds, personIds, page, pageSize }),
});

// Invalidate on mutation success
const mutation = useMutation({
    mutationFn: (newSettings: AppSettings) => service.saveSettings(newSettings),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
});
```

---

## Testing Approach

### Unit Testing Strategy

- **Utils**: Test pure functions in isolation
- **Hooks**: Use `@testing-library/react-hooks`
- **Components**: Use `@testing-library/react`
- **Services**: Mock external APIs

### Test File Naming

```
src/features/slideshow/
├── hooks/
│   ├── useSlideshow.ts
│   └── useSlideshow.test.ts    # Co-located tests
```

### Mocking Pattern

Use mock services for testing:

```typescript
// In tests
const mockServices: AppServices = {
    photos: new MockPhotoRepo(),
    weather: new MockWeatherService(),
    settings: new LocalSettingsService(),
    people: new MockPeopleRepo(),
};
```

---

## Common Patterns

### Pattern: Keyboard Shortcuts

Create a dedicated hook for keyboard handling:

```typescript
export function useSlideshowKeyboard(options: UseSlideshowKeyboardOptions) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                options.onPrevious();
            } else if (event.key === 'ArrowRight') {
                options.onNext();
            } else if (event.key === ' ') {
                event.preventDefault();
                options.onTogglePlayPause();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [options]);
}
```

### Pattern: Pure Utility Functions

Utilities are pure, side-effect-free functions:

```typescript
// features/photo-pool/utils/shuffle.ts
export function shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}
```

### Pattern: Preloading Images

```typescript
export function preloadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}
```

### Pattern: Debug Panel

Conditionally render debug info:

```tsx
{debug && (
    <div className="absolute bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg">
        <div>Current Index: {debug.currentIndex} / {debug.count}</div>
        <div>Playing: {debug.isPlaying ? '▶️' : '⏸️'}</div>
    </div>
)}
```

### Pattern: Environment-Based Config

```typescript
const isMock = import.meta.env.VITE_USE_MOCK === 'true';
export const services: AppServices = isMock ? mockServices : liveServices;
```

---

## Anti-Patterns (Avoid)

### ❌ Business Logic in Components

```tsx
// ❌ BAD: Logic in component
export const Slideshow = () => {
    const [index, setIndex] = useState(0);
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        fetch('/api/photos').then(res => res.json()).then(setPhotos);
    }, []);

    const goToNext = () => {
        if (index < photos.length - 1) {
            setIndex(index + 1);
        }
    };

    return <button onClick={goToNext}>Next</button>;
};

// ✅ GOOD: Logic in hook
export const Slideshow = () => {
    const { state, actions } = useSlideshow();
    return <button onClick={actions.goToNext}>Next</button>;
};
```

### ❌ Multiple Hooks Without Facade

```tsx
// ❌ BAD: Component orchestrates hooks
export const Slideshow = () => {
    const data = useSlideshowData();
    const timer = useSlideshowTimer({ onAdvance: data.goToNext });
    const keyboard = useSlideshowKeyboard({ onNext: data.goToNext });
    
    const handleNext = () => {
        data.goToNext();
        timer.reset();
    };
    
    return <button onClick={handleNext}>Next</button>;
};

// ✅ GOOD: Facade hook handles orchestration
export const Slideshow = () => {
    const { state, actions } = useSlideshow();
    return <button onClick={actions.goToNext}>Next</button>;
};
```

### ❌ DTOs Leaking into Components

```tsx
// ❌ BAD: Component imports DTO types
import type { ImmichAsset } from '@immich/sdk';

export const PhotoDisplay = ({ asset }: { asset: ImmichAsset }) => {
    return <img src={asset.thumbnailPath} />;
};

// ✅ GOOD: Component uses domain types
import type { Photo } from '../types';

export const PhotoDisplay = ({ photo }: { photo: Photo }) => {
    return <img src={photo.url} />;
};
```

### ❌ Premature State Promotion

```tsx
// ❌ BAD: Lifting state too early
const [isSettingsOpen, setIsSettingsOpen] = useState(false);

// ✅ GOOD: Keep local until needed elsewhere
// Only promote when multiple components need it
```

---

## Checklist for New Features

- [ ] Create feature folder: `features/[name]/`
- [ ] Define domain types in `types.ts`
- [ ] Create repository interface and implementations
- [ ] Write data fetching hooks (TanStack Query)
- [ ] Write business logic hooks
- [ ] Create facade hook if multiple sub-hooks exist
- [ ] Build presentational components
- [ ] Export public API via `index.ts`
- [ ] Add to service context if needed
- [ ] Write tests for utils and hooks

---

## Quick Reference

### Import Patterns

```typescript
// ✅ Feature imports
import { useSlideshow } from '../hooks/useSlideshow';
import type { Photo } from '../types';

// ✅ Shared imports
import { useControls } from '../../../shared/hooks';
import type { SlideshowFilter } from '../../../shared/types/config';

// ✅ External imports
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
```

### File Templates

#### Component Template

```tsx
import type { ComponentProps } from './types'; // or inline

interface [Component]Props {
    // Props
}

export const [Component] = ({ prop1, prop2 }: [Component]Props) => {
    return (
        <div>
            {/* Render */}
        </div>
    );
};
```

#### Hook Template

```typescript
import type { Use[Hook]Return } from './types';

interface Use[Hook]Options {
    // Options
}

export function use[Hook](options: Use[Hook]Options): Use[Hook]Return {
    // Logic
    
    return {
        state: {},
        actions: {},
    };
}
```

---

## Resources

- **TanStack Query**: https://tanstack.com/query/latest
- **React Patterns**: https://react.dev/learn
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

## Notes for AI Coding Agents

When working on this codebase:

1. **Always check for existing patterns** before creating new ones
2. **Use facade hooks** for complex orchestration
3. **Map DTOs in repositories**, never expose API shapes
4. **Keep components dumb**, move logic to hooks
5. **Use explicit return types** for hooks
6. **Follow naming conventions** strictly
7. **Group return values** as `{ state, actions, debug }`
8. **Export types** via barrel exports
9. **Use TanStack Query** for server state
10. **Test in isolation** with mock services

When in doubt, look at existing features (especially `slideshow/`) as reference implementations.