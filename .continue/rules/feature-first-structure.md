---
description: When creating new features or organizing code
---

Use feature-first architecture: src/features/[feature]/ with subfolders: components/ (UI only), hooks/ (business logic facade), repos/ (API adapters), services/ (external services), types.ts (domain models), index.ts (public API). Features are self-contained. Cross-feature utilities go in src/shared/.