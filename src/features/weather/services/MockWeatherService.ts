import type { WeatherService } from "../types";

export class MockWeatherService implements WeatherService {
    async getWeather() {
        return { temp: 22, condition: 'sunny' as const, city: 'Mocksville' };
    }
}