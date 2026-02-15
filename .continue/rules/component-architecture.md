---
globs: "**/*.tsx"
alwaysApply: false
---

Components must be presentational only - UI and user interactions. Components should call ONE facade hook for business logic. Never put business logic in components, never call services directly, never import DTOs. Return grouping pattern: { state, actions, debug? }