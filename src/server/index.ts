import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { loadConfig } from './config';
import { createApiRouter } from './routes';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load and validate configuration
const config = loadConfig();

// Initialize Express app
const app = express();

// 1. Mount all API routes under /api/*
app.use('/api', createApiRouter(config));

// 2. Serve the React Production Build
// __dirname is src/server, so we need to go up two levels to reach project root
const buildPath = path.join(__dirname, '../../dist');
app.use(express.static(buildPath));

// Catch-all route for SPA (Express 5 compatible)
app.use((_req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(config.PORT, () => {
    console.log(`\n=================================`);
    console.log(`BFF Server running on http://localhost:${config.PORT}`);
    console.log(`API Endpoints:`);
    console.log(`  - /api/immich/* -> ${config.IMMICH_URL}`);
    console.log(`  - /api/weather -> OpenWeatherMap`);
    console.log(`=================================\n`);
});