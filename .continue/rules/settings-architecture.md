---
description: When adding new application settings or modifying existing settings
---

When adding new settings: 1) Update AppSettings interface in features/settings/types.ts, 2) Add default in buildDefaultSettings() in features/settings/utils/buildDefaultSettings.ts with env var parsers, 3) Add env var types in src/env.d.ts. Access settings via useSettingsData() hook. Never hardcode defaults in components, never access localStorage directly.