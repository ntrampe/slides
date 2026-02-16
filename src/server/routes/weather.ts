import { Router } from 'express';
import type { ServerConfig } from '../config';

/**
 * Creates an Express router for weather API endpoints
 * Path: /api/weather
 */
export function createWeatherRouter(config: ServerConfig): Router {
    const router = Router();

    /**
     * GET /api/weather?lat=<lat>&lon=<lon>
     * Proxies to OpenWeatherMap with server-side API key
     */
    router.get('/', async (req, res) => {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ error: 'Missing lat or lon parameters' });
        }

        if (!config.OWM_KEY) {
            return res.status(503).json({ error: 'Weather service not configured' });
        }

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.OWM_KEY}&units=metric`;
            
            console.log(`[Weather] Fetching weather for lat=${lat}, lon=${lon}`);
            
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`OpenWeatherMap API failed: ${response.status}`);
            }

            const data = await response.json();
            res.json(data);
        } catch (error) {
            console.error('[Weather] Error:', error);
            res.status(500).json({ error: 'Failed to fetch weather data' });
        }
    });

    return router;
}
