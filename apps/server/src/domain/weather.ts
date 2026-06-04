export type DomainWeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';

export interface DomainWeatherData {
    temp: number;
    condition: DomainWeatherCondition;
    city: string;
}
