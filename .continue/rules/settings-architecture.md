---
description: When adding new application settings or modifying existing settings
---

When adding settings: 1) Add to AppSettings interface in features/settings/types.ts, 2) Add default in DEFAULT_APP_SETTINGS (features/settings/constants.ts) using parser functions (parseBool/parseNumber/parseString) with VITE_* env vars, 3) Declare env var types in src/env.d.ts, 4) Add Docker ARG/ENV pairs in Dockerfile if deploying. Access via useSettingsData() hook. Settings persist to localStorage and load via TanStack Query. Never hardcode defaults in components, never access localStorage/env vars directly.