import type { WeatherData } from '@slides/api-contract';
import { apiGet } from './http.js';

export async function fetchWeather(): Promise<WeatherData> {
    const search = typeof window !== 'undefined' ? window.location.search : '';
    return apiGet<WeatherData>(`/weather${search}`);
}
