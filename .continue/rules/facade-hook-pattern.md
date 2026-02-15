---
globs: "**/hooks/*.ts"
regex: ^export function use[A-Z]
alwaysApply: false
---

Hooks must follow the facade pattern: one public hook orchestrates multiple sub-hooks. Return interface must be explicitly typed as Use[Name]Return with grouped structure: { state: {...}, actions: {...}, debug?: {...} }. Never return unstructured objects from hooks.