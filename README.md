# 🖼️ Immich Slideshow

A beautiful, customizable slideshow application for your [Immich](https://immich.app) photo library. Perfect for digital photo frames, kiosks, and displays.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6.svg)
![Docker](https://img.shields.io/badge/Docker-ready-2496ed.svg)

## ✨ Features

- 🎨 **Modern UI** - Clean, responsive interface with light/dark themes
- 🔀 **Smart Shuffle** - Random photo ordering with customizable intervals
- 📱 **Flexible Layouts** - Single image or split-screen view
- 🏷️ **Advanced Filtering** - Filter by albums, people, and locations
- ⏱️ **Customizable Timing** - Set your preferred slideshow interval
- 🕐 **Optional Overlays** - Clock, weather, and photo metadata
- ⌨️ **Keyboard Control** - Full keyboard navigation support
- 💾 **Persistent Settings** - Your preferences saved in browser
- 🎭 **Smooth Transitions** - Fade, slide, or instant transitions
- 🐳 **Docker Ready** - Easy deployment with Docker/Docker Compose

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

That's it! The slideshow is now running. All other settings can be customized in the UI.

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

# Start production server (serves built frontend)
node --loader tsx src/server/index.ts
```

## ⚙️ Configuration

### Required Settings

| Variable | Description |
|----------|-------------|
| `IMMICH_URL` | Your Immich server URL (e.g., `http://localhost:2283`) |
| `IMMICH_API_KEY` | Your Immich API key (get from User Settings → API Keys) |

### Optional Settings

All other settings have sensible defaults and can be:
- **Changed in the UI** - Settings panel is accessible via the ⚙️ icon or press `S`
- **Pre-configured via environment variables** - See [.env.example](.env.example) for full list

Available options include:
- Layout and display preferences
- Slideshow timing and transitions
- Photo filters (albums, people, locations)
- Weather integration (requires OpenWeatherMap API key)
- UI customization (theme, overlays, font size)

**All settings persist in browser localStorage** - your preferences are saved automatically.

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Space** | Play/Pause slideshow |
| **→** or **L** | Next photo |
| **←** or **H** | Previous photo |
| **S** | Toggle settings panel |
| **D** | Toggle debug mode |

## 🏗️ Architecture

This project uses a **feature-first architecture**:

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

See [best_practices.md](best_practices.md) for detailed patterns.

## 🛠️ Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite (build tool)
- TanStack Query (data fetching)
- Tailwind CSS 4 (styling)
- Lucide Icons

**Backend:**
- Node.js + Express
- http-proxy-middleware (Immich proxy)
- TypeScript (tsx runtime)

**Integration:**
- Immich SDK
- OpenWeatherMap API (optional)

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