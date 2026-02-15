import { Sun, Cloud, CloudRain, Snowflake, CloudLightning } from 'lucide-react';
import type { WeatherCondition } from '../types';
import { HudPanel, hudTextSizes } from '../../../shared/components';

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
        <HudPanel variant="subtle" className="flex items-center gap-2 sm:gap-3">
            <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
            <div>
                <div className={`font-bold ${hudTextSizes.body}`}>{temp}°C</div>
                <div className="text-xs uppercase tracking-widest opacity-70">{city}</div>
            </div>
        </HudPanel>
    );
};