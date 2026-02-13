import type { WeatherCondition, WeatherData, WeatherService } from "../types";

export class OWMWeatherService implements WeatherService {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async getWeather(lat: number, lon: number): Promise<WeatherData> {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
        );
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