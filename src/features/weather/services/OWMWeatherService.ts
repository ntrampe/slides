import type { WeatherCondition, WeatherData, WeatherService } from "../types";

export class OWMWeatherService implements WeatherService {
    async getWeather(lat: number, lon: number): Promise<WeatherData> {
        // Call our backend endpoint instead of OpenWeatherMap directly
        const res = await fetch(
            `/api/weather?lat=${lat}&lon=${lon}`
        );

        if (!res.ok) {
            throw new Error(`Weather API failed: ${res.status}`);
        }

        const data = await res.json();

        return {
            temp: Math.round(data.main.temp),
            city: data.name,
            condition: this.mapCondition(data.weather[0].main),
        };
    }

    private mapCondition(main: string): WeatherCondition {
        const map: Record<string, WeatherCondition> = {
            Clear: 'sunny',
            Clouds: 'cloudy',
            Rain: 'rainy',
            Snow: 'snowy',
            Thunderstorm: 'stormy',
        };
        return map[main] || 'sunny';
    }
}