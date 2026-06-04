import type { ServerConfig } from '../config.js';
import { NetworkError, NETWORK_ERROR_CODES, ServerError } from '@slides/shared/errors';
import type { DomainWeatherCondition, DomainWeatherData } from '../domain/weather.js';

export class WeatherService {
    constructor(private readonly config: ServerConfig) {}

    async getWeather(lat: number, lon: number): Promise<DomainWeatherData> {
        if (!this.config.OWM_KEY) {
            throw new ServerError('Weather service not configured', 503);
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.config.OWM_KEY}&units=metric`;

        let response: globalThis.Response;
        try {
            response = await fetch(url);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new NetworkError(
                `Unable to reach weather service: ${message}`,
                NETWORK_ERROR_CODES.REFUSED
            );
        }

        if (!response.ok) {
            throw new ServerError(`OpenWeatherMap API failed: ${response.status}`, response.status);
        }

        const data = (await response.json()) as {
            main: { temp: number };
            name: string;
            weather: { main: string }[];
        };

        return {
            temp: Math.round(data.main.temp),
            city: data.name,
            condition: mapCondition(data.weather[0]?.main),
        };
    }
}

function mapCondition(main: string | undefined): DomainWeatherCondition {
    const map: Record<string, DomainWeatherCondition> = {
        Clear: 'sunny',
        Clouds: 'cloudy',
        Rain: 'rainy',
        Snow: 'snowy',
        Thunderstorm: 'stormy',
    };
    return (main && map[main]) || 'sunny';
}
