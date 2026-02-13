export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';

export interface WeatherData {
    temp: number;
    condition: WeatherCondition;
    city: string;
}

export interface WeatherService {
    getWeather: (lat: number, lon: number) => Promise<WeatherData>;
}