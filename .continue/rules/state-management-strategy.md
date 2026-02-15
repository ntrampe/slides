---
description: When deciding how to manage state in the application
---

Use appropriate state management: 1) Local UI (transient: hover, focus) → useState, 2) Business logic → Custom hooks, 3) Server data → TanStack Query with queryKey/queryFn pattern, 4) Global UI (settings, theme) → Context. For infinite queries, flatten pages with useMemo.