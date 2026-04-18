import { LocateFixed } from 'lucide-react';
import { useWeatherCurrentLocation } from '../hooks/useWeatherCurrentLocation';

export const WeatherCurrentLocationButton = () => {
    const { state, actions } = useWeatherCurrentLocation();

    return (
        <div className="space-y-1">
            <button
                type="button"
                onClick={actions.requestLocation}
                disabled={state.locating}
                className="inline-flex items-center justify-center gap-2 w-full bg-surface border border-border hover:bg-surface/80 disabled:opacity-50 disabled:cursor-not-allowed text-text-primary font-medium py-2 px-4 rounded transition-colors"
            >
                <LocateFixed size={18} className="shrink-0" aria-hidden />
                {state.locating ? 'Getting location…' : 'Use current location'}
            </button>
            {state.error && (
                <p className="text-sm text-error" role="alert">
                    {state.error}
                </p>
            )}
        </div>
    );
};
