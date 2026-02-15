---
globs: "**/*.tsx"
regex: className=
alwaysApply: false
---

Always use semantic CSS variables for theming: bg-background, bg-surface for backgrounds; text-text-primary, text-text-secondary for text; border-border for borders; bg-primary-500, hover:bg-primary-600 for actions; text-success, text-error, text-warning for status. NEVER use hardcoded colors like bg-gray-100, text-slate-900, border-gray-300 in UI chrome. Exception: overlays on photos can use text-white, bg-black/20.