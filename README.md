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

   Overrides are written to `./data/settings.json` (mounted to `/app/data` inside the container).

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

**All UI settings persist via the backend `/api/v1/settings` endpoint** and take highest precedence.
These overrides are shared across clients on the same server instance; clients poll every few seconds so changes show up on other displays quickly.

> [!NOTE]
> **Durability:** UI overrides survive server restarts. In Docker, mount a volume to `DATA_DIR` (the included `docker-compose.yml` maps `./data` on the host to `/app/data` in the container). If you delete that volume or run without a mount, overrides are lost when the container is recreated.

The HTTP API is also suitable for home automation (for example Home Assistant `rest_command`) to update kiosk settings remotely.

#### Advanced filtering

For **albums** and **people**, you can tune how multiple selections combine:

- **All** (AND) — a photo must match every selected album or every selected person in that group.
- **Any** (OR) — a photo may match any one of the selected albums or any one of the selected people in that group.

You can also **exclude** albums or people: photos in an excluded album, or tagged with an excluded person, are left out of the slideshow (a NOT-style filter on top of your inclusions).

When you filter by **both** albums and people, an extra control lets you **combine** those two parts with **All** or **Any** (for example, photos must satisfy both the album rules and the people rules, or either set of rules).

These options use the same slideshow filter settings as URL and environment configuration (see `@slides/api-contract` / `apps/web/src/features/settings/types.ts`).

### 2. 🔗 URL Parameters (Perfect for kiosks & presets)

Configure settings dynamically via URL query parameters using dot-notation:

```
http://localhost:3000/?slideshow.layout=split&photos.animation.type=ken-burns&theme.mode=dark
```

Refer to `@slides/api-contract` (`AppSettings`) or `apps/web/src/features/settings/types.ts` for the settings structure.

**Examples:**

```bash
# Kiosk mode with specific album
?slideshow.filter.albumIds=abc123,def456&slideshow.autoplay=true

# Vacation photos with date range
?slideshow.filter.startDate=2024-01-01&slideshow.filter.endDate=2024-12-31

# Cinematic display with animations
?photos.animation.type=ken-burns&photos.animation.intensity=1.5&slideshow.transition.type=fade

# Location-specific slideshow
?slideshow.filter.location.country=USA&slideshow.filter.location.state=California
```

URL settings override environment defaults but are overridden by user settings from `/api/v1/settings`.

### 3. 🔧 Environment Variables (Docker & defaults)

Set default configuration via environment variables (prefix: `DEFAULT_*`):

#### Required Settings

| Variable | Description | Example |
|----------|-------------|---------|
| `IMMICH_URL` | Your Immich server URL | `http://localhost:2283` |
| `IMMICH_API_KEY` | Your Immich API key | Get from User Settings → API Keys |

#### Optional Settings

See `.env.example` for a complete list.

### Configuration Precedence

Settings are resolved in this order (highest to lowest precedence):

1. **User Settings** (`/api/v1/settings`) - Highest priority
2. **URL Parameters** - Session-specific overrides
3. **Environment Variables** (`DEFAULT_*`) - Default configuration
4. **Hardcoded Fallbacks** - Guaranteed baseline

This means you can set organization defaults via Docker env vars, allow per-kiosk customization via URLs, and still save personal preferences in the UI.

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

**Server** owns Immich query building, filter operators, exclusions, catalog aggregation, settings resolution, shuffle ordering, and weather mapping.

**Client** hooks call `apps/web/src/api/*` fetchers (TanStack Query). The same `/api/v1` contract can power native clients (e.g. Flutter).

**Offline demo** (`npm run build:demo`): sets `VITE_USE_MOCK=true`, which installs a global `fetch` interceptor in `apps/web/src/mocks/` — no mock branches in production fetchers.

### Client profiles

#### Slideshow-only client (e.g. Flutter kiosk)

| Endpoint | Required |
|----------|----------|
| `GET /api/v1/meta` | Yes — `{ apiVersion, contractVersion }` for client/server contract checks |
| `GET /api/v1/slideshow` | Yes — ordered photo list (filtering + shuffle run server-side) |
| `GET /api/v1/assets/:id/thumbnail` | Yes — proxied image bytes (API key never exposed) |
| `GET /api/v1/assets/:id/video` | If live photos are enabled |
| `GET /api/v1/settings/resolved` | Yes — resolved configuration (defaults + URL + user overrides) |
| `PUT /api/v1/settings` / `DELETE /api/v1/settings` | Optional — if the client has a settings UI |
| `GET /api/v1/albums`, `/people`, `/locations` | Optional — only if building a filter picker UI |
| `GET /api/v1/weather` | Optional — only if displaying a weather HUD |

Call `/meta` first, then `/slideshow` and `/settings/resolved` in parallel at startup. Settings can be refreshed independently of the photo list.

#### Full web kiosk (current React app)

Everything in the slideshow-only profile, plus:

| Endpoint | Used by |
|----------|---------|
| `GET /api/v1/settings/resolved` | `useSettingsData` — polled every 3 s for live sync across displays |
| `GET/PUT/DELETE /api/v1/settings` | Settings panel overrides CRUD |
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