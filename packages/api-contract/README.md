# @slides/api-contract

Single source of truth for the Slides `/api/v1` HTTP contract.

## Workflow

1. Edit `openapi.yaml`.
2. Run `npm run contract:gen` from the repo root (or `npm run gen` in this package).
3. Fix any TypeScript errors in `apps/server` (HTTP mappers) or `apps/web` (API fetchers).

Generated artifacts:

- `src/generated/openapi.ts` — TypeScript types (`paths`, `components`, `operations`)
- `src/generated/schemas.ts` — Zod schemas for request validation

Import ergonomic aliases from `@slides/api-contract` (see `src/index.ts`).
