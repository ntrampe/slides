---
description: When adding new application settings or modifying existing settings
---

When adding settings: 1) Add to AppSettings interface in features/settings/types.ts, 2) Add default in server/config/defaultSettings.ts using DEFAULT_* env vars, 3) Add fallback in src/shared/constants.ts (FALLBACK_APP_SETTINGS), 4) Add env vars to .env.example and Docker if deploying. Access via useSettingsData() hook. Live mode persists user overrides via /api/settings (server in-memory; shared across clients; resets on restart). Mock mode (VITE_USE_MOCK) uses localStorage for overrides only. Defaults are served from /api/settings/defaults. Never hardcode defaults in components; never access localStorage or process.env directly in UI code.
