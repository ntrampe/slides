import { Sun, Cloud, CloudRain, Snowflake, CloudLightning } from 'lucide-react';
import type { WeatherCondition } from '../types';

const ICON_MAP = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain,
    snowy: Snowflake,
    stormy: CloudLightning,
};

export const WeatherDisplay = ({ temp, condition, city }: any) => {
    const Icon = ICON_MAP[condition as WeatherCondition] || Sun;

    return (
        <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md p-4 rounded-2xl">
            <Icon size={32} className="text-yellow-400" />
            <div className="text-white">
                <div className="text-2xl font-bold">{temp}°C</div>
                <div className="text-xs uppercase tracking-widest opacity-70">{city}</div>
            </div>
        </div>
    );
};