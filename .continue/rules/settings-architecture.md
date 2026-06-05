---
description: When adding new application settings or modifying existing settings
---

When adding settings:

1. Add the key to the appropriate domain schema in `packages/api-contract/openapi.yaml` (`QuerySettings`, `PlaybackSettings`, or `DisplaySettings`). `AppSettings` has exactly three top-level keys: `query`, `playback`, `display`.
2. Run `npm run contract:gen`.
3. Add `DEFAULT_*` mapping in `apps/server/src/domain/defaultSettings.ts` and fallback in `packages/shared/src/constants.ts`.
4. Document env vars in `.env.example`.

Access via `useSettingsData()`. Persist with targeted `PATCH /api/v1/settings/{domain}` (full domain body required). Live sync uses `GET /api/v1/events` (SSE) with domain events (`query_updated`, `playback_updated`, `display_updated`, `settings_cleared`).

URL session overrides use bracket notation forwarded to the server (e.g. `?query[shuffle]=false`). The web client never parses URL settings locally.

Mock mode (`VITE_USE_MOCK`) uses `localStorage` for per-domain overrides. Never hardcode defaults in components.
