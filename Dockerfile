# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/api-contract/package.json ./packages/api-contract/
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/

RUN npm ci

COPY packages/ ./packages/
COPY apps/web/ ./apps/web/
COPY tsconfig.json ./

RUN npm run contract:gen
RUN npm run build -w @slides/web

# Stage 2: Prepare server dependencies
FROM node:20-alpine AS server-deps

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/api-contract/package.json ./packages/api-contract/
COPY packages/shared/package.json ./packages/shared/
COPY apps/server/package.json ./apps/server/

RUN npm ci --omit=dev

# Stage 3: Production runtime
FROM node:20-alpine AS production

WORKDIR /app

COPY --from=server-deps /app/node_modules ./node_modules
COPY --from=server-deps /app/package.json ./package.json

COPY apps/server ./apps/server
COPY packages/api-contract ./packages/api-contract
COPY packages/shared ./packages/shared

COPY --from=frontend-builder /app/apps/web/dist ./apps/web/dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["npx", "tsx", "apps/server/src/index.ts"]
