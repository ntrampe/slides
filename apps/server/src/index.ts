import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { loadConfig } from './config.js';
import { createApiRouter } from './http/routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = loadConfig();

const app = express();

app.set('trust proxy', true);

app.use('/api', createApiRouter(config));

const buildPath = path.join(__dirname, '../../web/dist');
app.use(express.static(buildPath));

app.use((_req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(config.PORT, () => {
    console.log(`\n=================================`);
    console.log(`Slides API running on http://localhost:${config.PORT}`);
    console.log(`Domain API (/api/v1):`);
    console.log(`  - GET    /api/v1/slideshow              -> ordered photo list { photos, total }`);
    console.log(`  - GET    /api/v1/settings/resolved      -> merged effective settings`);
    console.log(`  - GET    /api/v1/albums | /people | /locations`);
    console.log(`  - GET    /api/v1/weather                -> OpenWeatherMap`);
    console.log(`  - GET/PUT/DELETE /api/v1/settings[/defaults]`);
    console.log(`  - GET    /api/v1/assets/:id/thumbnail | /video  -> ${config.IMMICH_URL}`);
    console.log(`=================================\n`);
});
