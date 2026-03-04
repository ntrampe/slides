# 🖼️ Slides

A beautiful, customizable slideshow application for your [Immich](https://immich.app) photo library. Perfect for digital photo frames, kiosks, and displays.

> [!IMPORTANT]
> **This project is not affiliated with [Immich](https://github.com/immich-app/immich)**

## ✨ Features

- 🎨 **Modern UI** - Clean, responsive interface with light/dark themes
- 🔀 **Smart Shuffle** - Random photo ordering with customizable intervals
- 📱 **Flexible Layouts** - Single image or split-screen view
- 🏷️ **Advanced Filtering** - Filter by albums, people, locations, and date ranges
- 🎬 **Photo Animations** - Ken Burns, zoom, pan, and more cinematic effects
- 🎞️ **Live Photos** - Support for live photos with configurable delay
- ⏱️ **Customizable Timing** - Set your preferred slideshow interval
- 🎭 **Smooth Transitions** - Fade, slide, or instant transitions between photos
- 🕐 **Optional Overlays** - Clock, weather, and photo metadata
- ⌨️ **Keyboard Control** - Full keyboard navigation support
- 💾 **Persistent Settings** - Your preferences saved in browser
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

3. **Start the container**
   ```bash
   docker-compose up -d
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

That's it! The slideshow is now running. All other settings can be customized in the UI, via URL parameters, or environment variables.

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
# Build frontend
npm run build

# Start production server (serves built frontend + API)
node --loader tsx src/server/index.ts
```

## ⚙️ Configuration

Slides offers **three ways** to configure settings, giving you maximum flexibility for different use cases:

### 1. 🎨 UI Configuration (Recommended for most users)

The intuitive settings panel (press `S` or click ⚙️) lets you configure everything visually:
- Layout and display preferences
- Slideshow timing and transitions
- Photo filters (albums, people, locations, date ranges)
- Photo animations and live photo settings
- Weather integration
- UI customization (theme, overlays, progress bar)

**All UI settings persist in browser localStorage** and take highest precedence.

### 2. 🔗 URL Parameters (Perfect for kiosks & presets)

Configure settings dynamically via URL query parameters using dot-notation:

```
http://localhost:3000/?slideshow.layout=split&photos.animation.type=ken-burns&theme.mode=dark
```

Refer to `src/features/settings/types.ts` for the settings structure.

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

URL settings override environment defaults but are overridden by user settings in localStorage.

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

1. **User Settings** (localStorage) - Highest priority
2. **URL Parameters** - Session-specific overrides
3. **Environment Variables** (`DEFAULT_*`) - Default configuration
4. **Hardcoded Fallbacks** - Guaranteed baseline

This means you can set organization defaults via Docker env vars, allow per-kiosk customization via URLs, and still save personal preferences in the UI.

## 🏗️ Architecture

This project uses a **feature-first architecture** with a secure Backend for Frontend (BFF) pattern:

```
src/
├── features/           # Feature modules
│   ├── slideshow/     # Slideshow logic
│   ├── photos/        # Photo management
│   ├── settings/      # User settings
│   └── .../          # Other features
├── shared/            # Shared utilities
├── server/            # Express backend
└── App.tsx           # Main app
```

Each feature is self-contained with:
- `components/` - UI components
- `hooks/` - Business logic
- `repos/` - API adapters
- `services/` - External services
- `types.ts` - Type definitions

### Why BFF?

1. **Security**: API keys (`IMMICH_API_KEY`, `OWM_KEY`) never exposed to browser
2. **Runtime Config**: Docker env vars read at server startup
3. **Proxy Pattern**: Transparent request forwarding with injected credentials
4. **Error Handling**: Centralized error transformation

See [best_practices.md](best_practices.md) for detailed patterns.

## 🛠️ Tech Stack

**Frontend:**
- React + TypeScript
- Vite (build tool)
- TanStack Query (data fetching)
- Tailwind CSS (styling)
- Lucide Icons

**Backend:**
- Node.js + Express
- http-proxy-middleware (Immich, Weather proxy)
- TypeScript (tsx runtime)

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