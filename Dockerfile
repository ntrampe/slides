# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY eslint.config.js ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Build the frontend (creates /app/dist)
RUN npm run build

# Stage 2: Prepare server dependencies
FROM node:20-alpine AS server-deps

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Stage 3: Production runtime
FROM node:20-alpine AS production

WORKDIR /app

# Copy production dependencies
COPY --from=server-deps /app/node_modules ./node_modules

# Copy server source
COPY src/server ./src/server

# Copy shared code (used by both server and client)
COPY src/shared ./src/shared

COPY tsconfig.server.json ./

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/dist ./dist

# Copy package.json for module resolution
COPY package.json ./

# Expose the port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run the server using tsx (TypeScript executor)
CMD ["npx", "tsx", "src/server/index.ts"]
