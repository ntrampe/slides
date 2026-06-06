# 🖼️ Slides

A beautiful, customizable slideshow application for your [Immich](https://immich.app) photo library. Perfect for digital photo frames, kiosks, and displays.

[![Try Demo](https://img.shields.io/badge/Try_Demo_Now-1e293b?style=for-the-badge&logo=rocket&logoColor=white&labelColor=1e293b)](https://ntrampe-slides.netlify.app/)

> [!IMPORTANT]
> **This project is not affiliated with [Immich](https://github.com/immich-app/immich)**

## ✨ Features

- 🎨 **Modern UI** - Clean, responsive interface with light/dark themes
- 🔀 **Smart Shuffle** - Random photo ordering with customizable intervals
- 📱 **Flexible Layouts** - Single image or split-screen view
- 🏷️ **Advanced Filtering** - Filter by albums, people, locations, and date ranges; **All** vs **Any** match modes per group; exclude specific albums or people; combine album and people criteria with **All** or **Any** when both are set
- 🎬 **Photo Animations** - Ken Burns, zoom, pan, and more cinematic effects
- 🎞️ **Live Photos** - Support for live photos with configurable delay
- ⏱️ **Customizable Timing** - Set your preferred slideshow interval
- 🎭 **Smooth Transitions** - Fade, slide, or instant transitions between photos
- 🕐 **Optional Overlays** - Clock, weather, and photo metadata
- ⌨️ **Keyboard Control** - Full keyboard navigation support
- 💾 **Persistent Settings** - UI preferences saved on the server (shared across displays on the same instance)
- 🔗 **URL Configuration** - Configure via URL query parameters
- 🐳 **Docker Ready** - Easy deployment with Docker/Docker Compose
- 🔒 **Secure** - API keys handled server-side, never exposed to browser

## 🚀 Quick Start

### 🐳 Docker Installation (Recommended)

1. **Download the files**
   ```bash
   curl -O https://raw.githubusercontent.com/ntrampe/slides/refs/heads/main/docker-compose.yml
   curl -O https://raw.githubusercontent.com/ntrampe/slides/refs/heads/main/.env.example
   ```

2. **Configure your environment**
   ```bash
   cp .env.example .env
   nano .env
   ```
   
   Edit the required settings:
   ```env
   IMMICH_URL=http://your-immich-server:2283
   IMMICH_API_KEY=your-api-key-here
   ```

3. **Create the data directory**

   UI settings overrides are persisted to a `data` folder on the host. Create it next to `docker-compose.yml` before starting the container:

   ```bash
   mkdir -p data
   ```

4. **Start the container**
   ```bash
   docker-compose up -d
   ```

   Overrides are written to `./data/settings.{query,playback,configuration}.json` (mounted to `/app/data` inside the container).

5. **Open in browser**
   ```
   http://localhost:3000
   ```

That's it! The slideshow is now running. All other settings can be customized in the UI, via URL parameters, or environment variables.

## ⚙️ Configuration

Slides offers **three ways** to configure settings, giving you maximum flexibility for different use cases:

### 1. 🎨 UI Configuration (Recommended for most users)

The intuitive settings panel (press `S` or click ⚙️) lets you configure everything visually:
- Layout and display preferences
- Slideshow timing and transitions
- Photo filters (albums, people, locations, date ranges), including match modes and exclusions (see [Advanced filtering](#advanced-filtering) below)
- Photo animations and live photo settings
- Weather integration
- UI customization (theme, overlays, progress bar)

**Server settings** persist via targeted `PATCH /api/v1/settings/{query,playback,configuration}` endpoints. **Presentation toggles** (theme, HUD visibility) persist per-browser in `localStorage`.
Changes are pushed to all kiosks over **`GET /api/v1/events`** (domain-scoped SSE events); the web client no longer polls settings.

> [!NOTE]
> **Durability:** UI overrides survive server restarts. In Docker, mount a volume to `DATA_DIR` (the included `docker-compose.yml` maps `./data` on the host to `/app/data` in the container). If you delete that volume or run without a mount, overrides are lost when the container is recreated.

The HTTP API is also suitable for home automation (for example Home Assistant `rest_command`) to update kiosk settings remotely.

#### Advanced filtering

For **albums** and **people**, you can tune how multiple selections combine:

- **All** (AND) — a photo must match every selected album or every selected person in that group.
- **Any** (OR) — a photo may match any one of the selected albums or any one of the selected people in that group.

You can also **exclude** albums or people: photos in an excluded album, or tagged with an excluded person, are left out of the slideshow (a NOT-style filter on top of your inclusions).

When you filter by **both** albums and people, an extra control lets you **combine** those two parts with **All** or **Any** (for example, photos must satisfy both the album rules and the people rules, or either set of rules).

**Date filtering** uses a `datePreset` (`all`, `today`, `week`, `month`, `year`, or `custom`). Relative presets are resolved on the server and stay current (for example, Past Year always means the last 365 days through today). Custom ranges use explicit `startDate` and `endDate` bounds.

These options use the same slideshow filter settings as URL and environment configuration (see `@slides/api-contract` / `apps/web/src/features/settings/types.ts`).

### 2. URL query overrides (kiosk presets)

Override settings per browser session via bracket-notation query parameters (not persisted, not broadcast on SSE):

```
http://localhost:3000/?playback[intervalMs]=30000&playback[layout]=split&configuration[hourFormat]=24&query[shuffle]=true
```

**Examples:**

```bash
# Specific albums (comma-separated IDs)
?query[albumIds]=abc123,def456&playback[autoplay]=true

# Relative date preset (resolved server-side)
?query[datePreset]=year

# Custom date range (requires datePreset=custom)
?query[datePreset]=custom&query[startDate]=2024-01-01&query[endDate]=2024-12-31

# Location filter
?query[locationCountry]=USA&query[locationState]=California
```

`seed` remains a client slideshow param (stable shuffle), not a settings key. Pass settings on `GET /api/v1/settings` and `GET /api/v1/weather`; the web app forwards `window.location.search` automatically.

### 3. Environment Variables (Docker & defaults)

Set default configuration via environment variables (prefix: `DEFAULT_*`):

#### Required Settings

| Variable | Description | Example |
|----------|-------------|---------|
| `IMMICH_URL` | Your Immich server URL | `http://localhost:2283` |
| `IMMICH_API_KEY` | Your Immich API key | Get from User Settings → API Keys |

#### Optional Settings

See `.env.example` for a complete list.

### Configuration precedence

On each `GET /api/v1/settings` (and weather), effective config merges in order:

1. **Hardcoded fallbacks** (`FALLBACK_APP_SETTINGS`)
2. **Environment variables** (`DEFAULT_*`) — applied at server boot into defaults
3. **Persisted overrides** (`PATCH /api/v1/settings/{domain}` → `DATA_DIR/settings.{domain}.json`)
4. **URL query parameters** — session-only, highest precedence (not saved, not in SSE payloads)

Remote updates (UI, Home Assistant, etc.) replace per-domain persisted overrides and broadcast domain events on the SSE stream; kiosks with URL params invalidate and refetch settings after SSE so local query overrides stay applied.

## 🏗️ Architecture

This project is an **npm workspaces monorepo** with a **feature-first thin client** and a **server-side domain API** (`/api/v1`):

```
apps/web/                    # React + Vite + TanStack Query
├── src/api/                 # Thin fetchers -> /api/v1 (production only)
├── src/features/            # UI, hooks (facade pattern)
└── src/mocks/               # Demo-only fetch interceptor (VITE_USE_MOCK)

apps/server/                 # Express
├── src/domain/              # Business rules, settings, Immich mapping
├── src/services/            # Application services
├── src/http/routes/v1/      # Versioned REST + asset proxy
└── src/infra/               # Immich client, link builder

packages/api-contract/       # OpenAPI -> generated types + Zod schemas
packages/shared/             # FALLBACK_APP_SETTINGS, errors, utilities
```

**Server** owns Immich query building, domain-grouped configuration (`query`, `playback`, `configuration`), and SSE settings broadcast. It does **not** track playback index or timers. Presentation preferences (theme, overlays) are client-local.

**Client** fetches `GET /settings` once, subscribes to `GET /events`, runs a local playback engine (timer, index, transitions), and loads photos via `POST /slideshow/query`.

**Offline demo** (`npm run build:demo`): sets `VITE_USE_MOCK=true`, which installs a global `fetch` interceptor in `apps/web/src/mocks/` — no mock branches in production fetchers.

### Client profiles

#### Slideshow-only client (e.g. Flutter kiosk)

| Endpoint | Required |
|----------|----------|
| `GET /api/v1/meta` | Yes — `{ apiVersion, contractVersion }` for client/server contract checks |
| `GET /api/v1/settings` | Yes — effective domain-grouped configuration |
| `GET /api/v1/events` | Yes — SSE for settings updates |
| `POST /api/v1/slideshow/query` | Yes — stateless photo list (query settings in JSON body) |
| `GET /api/v1/assets/:id/thumbnail` | Yes — proxied image bytes (API key never exposed) |
| `GET /api/v1/assets/:id/video` | If live photos are enabled |
| `PATCH /api/v1/settings/{domain}` / `DELETE /api/v1/settings` | Optional — if the client has a settings UI |
| `GET /api/v1/albums`, `/people`, `/locations` | Optional — only if building a filter picker UI |
| `GET /api/v1/weather` | Optional — only if displaying a weather HUD |

Call `/meta` first, then `/settings` + `/events`, then `POST /slideshow/query` with query fields from settings.

#### Full web kiosk (current React app)

Everything in the slideshow-only profile, plus:

| Endpoint | Used by |
|----------|---------|
| `GET /api/v1/settings` | `useSettingsData` — boot fetch (no polling) |
| `GET /api/v1/events` | `useSyncEvents` — live settings sync |
| `POST /api/v1/slideshow/query` | `useSlideshowData` — `settings.query` spread into body with `seed` |
| `PATCH/DELETE /api/v1/settings/{domain}` | Settings panel CRUD |
| `GET /api/v1/albums`, `/people`, `/locations` | Settings panel filter pickers |
| `GET /api/v1/weather` | Slideshow HUD overlay |

`/assets/*` is not a JSON API — it proxies binary media with the Immich API key injected server-side, so the key is never exposed to the browser.

Optional `PUBLIC_BASE_URL` env var emits absolute media URLs for clients that cannot derive the host from requests.

See [best_practices.md](best_practices.md) for detailed patterns, [packages/api-contract/README.md](packages/api-contract/README.md) for the wire contract, and [packages/api-contract/openapi.yaml](packages/api-contract/openapi.yaml) for the machine-readable OpenAPI spec (useful for Flutter codegen).

## 🛠️ Tech Stack

**Frontend:**
- React + TypeScript
- Vite (build tool)
- TanStack Query (data fetching)
- Tailwind CSS (styling)
- Lucide Icons

**Backend:**
- Node.js + Express
- Versioned domain API (`/api/v1`) with Immich client + asset streaming proxy
- TypeScript (tsx runtime)

### 💻 Local Development

For development or manual setup:

#### Prerequisites

- Node.js 20+ and npm
- Running Immich instance
- Immich API key

#### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Immich details:
   ```env
   IMMICH_URL=http://localhost:2283
   IMMICH_API_KEY=your-api-key-here
   ```

3. **Start development servers**
   
   Place a `.env` file at the **repo root** (next to `docker-compose.yml`). `dev:server` loads it via `node --env-file=../../.env`.
   
   Terminal 1 - Backend:
   ```bash
   npm run dev:server
   ```
   
   Terminal 2 - Frontend:
   ```bash
   npm run dev:ui
   ```

4. **Open browser**
   ```
   http://localhost:5173
   ```

#### Production Build

```bash
# Regenerate contract types, build frontend into apps/web/dist
npm run build

# Start production server (serves built frontend + API; requires env vars)
npm run start -w @slides/server
```

#### Offline demo build (Netlify / static hosting)

```bash
npm run build:demo
```

Serves canned slideshow data via the mock `fetch` interceptor — no Immich server required.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Follow the architecture patterns in [best_practices.md](best_practices.md)
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- [Immich](https://immich.app) - Amazing self-hosted photo management
- Built with React, TypeScript, and Vite

## 📞 Support

- 📖 [Immich Docs](https://immich.app/docs)