# Codebase Architecture & Patterns

**Project:** Immich Slides - Photo slideshow (React 19 + TypeScript + Vite)  
**Stack:** TanStack Query, Tailwind CSS 4, Lucide Icons

---

## Architecture

**Feature-first structure** with clear separation of concerns:

```
src/
├── features/          # Feature modules (self-contained)
│   └── [feature]/
│       ├── components/   # Presentational UI only
│       ├── hooks/        # Business logic (facade pattern)
│       ├── repos/        # API adapters (DTO → domain)
│       ├── services/     # External services
│       ├── types.ts      # Domain models
│       └── index.ts      # Public API
├── shared/            # Cross-feature utilities
└── server/            # Express proxy for Immich API
```

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

### Repositories
- Map **DTO → domain models** (never expose API shapes)
- Implement interfaces for testability

```typescript
export interface PhotoRepo {
    getPhotos(params: PaginationParams): Promise<PaginatedPhotos>;
}

export class ImmichPhotoRepo implements PhotoRepo {
    async getPhotos(params) {
        const res = await fetch(/*...*/);
        // ✅ Map to domain model
        return assets.map(asset => ({
            id: asset.id,
            url: `${this.proxyUrl}/api/assets/${asset.id}/thumbnail`,
            createdAt: new Date(asset.fileCreatedAt),
        }));
    }
}
```

---

## Theming (Tailwind CSS 4)

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
    queryKey: ['photos', { albumIds, page }],
    queryFn: () => photoRepo.getPhotos({ albumIds, page }),
});

// Context pattern
export const useServices = () => useContext(ServiceContext);
```

---

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Component | PascalCase.tsx | `PhotoDisplay.tsx` |
| Hook | use*.ts | `useSlideshow.ts` |
| Service/Repo | *Service.ts / *Repo.ts | `ImmichPhotoRepo.ts` |
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

### Infinite Query Flattening
```typescript
const query = useInfiniteQuery({/*...*/});
const allPhotos = useMemo(() => 
    query.data?.pages.flatMap(p => p.photos) ?? [], 
    [query.data]
);
```

### Settings Mutation
```typescript
const mutation = useMutation({
    mutationFn: (s: AppSettings) => service.saveSettings(s),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
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

1. Create `features/[name]/` with folders: components, hooks, repos, types.ts
2. Define domain types (stable models)
3. Create repository interface + implementations
4. Write data hooks (TanStack Query)
5. Write facade hook
6. Build presentational components
7. Export via `index.ts`

---

## Notes for AI Agents

- **Components = dumb presentational UI** calling facade hooks
- **Hooks = orchestrate logic** via facade pattern
- **Repos = map DTO → domain** (never expose API shapes)
- **Theming = semantic CSS variables** (`bg-surface`, not `bg-gray-100`)
- **Types = explicit interfaces** (`UseSlideshowReturn`, not inferred)
- Look at `features/slideshow/` for reference patterns

**Environment**: `VITE_USE_MOCK=true` switches to mock services for testing.