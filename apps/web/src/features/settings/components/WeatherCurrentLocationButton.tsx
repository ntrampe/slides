import { AlertCircle, Check, LocateFixed } from 'lucide-react';
import {
    useWeatherCurrentLocation,
    WeatherCurrentLocationStatus
} from '../hooks/useWeatherCurrentLocation';

export const WeatherCurrentLocationButton = () => {
    const { state, actions } = useWeatherCurrentLocation();
    const { status, errorMessage } = state;

    const label =
        status === WeatherCurrentLocationStatus.Loading
            ? 'Getting location…'
            : status === WeatherCurrentLocationStatus.Success
              ? 'Location updated'
              : status === WeatherCurrentLocationStatus.Error
                ? (errorMessage ?? 'Something went wrong.')
                : 'Use current location';

    const icon =
        status === WeatherCurrentLocationStatus.Success ? (
            <Check
                size={18}
                className="shrink-0 text-success"
                aria-hidden
            />
        ) : status === WeatherCurrentLocationStatus.Error ? (
            <AlertCircle
                size={18}
                className="shrink-0 text-error"
                aria-hidden
            />
        ) : (
            <LocateFixed size={18} className="shrink-0" aria-hidden />
        );

    const labelClassName =
        status === WeatherCurrentLocationStatus.Success
            ? 'text-success'
            : status === WeatherCurrentLocationStatus.Error
              ? 'text-error'
              : undefined;

    return (
        <button
            type="button"
            onClick={actions.requestLocation}
            disabled={status === WeatherCurrentLocationStatus.Loading}
            className="inline-flex items-center justify-center gap-2 w-full bg-surface border border-border hover:bg-surface/80 disabled:opacity-50 disabled:cursor-not-allowed text-text-primary font-medium py-2 px-4 rounded transition-colors"
        >
            {icon}
            <span
                className={labelClassName}
                aria-live={
                    status === WeatherCurrentLocationStatus.Error
                        ? 'assertive'
                        : status === WeatherCurrentLocationStatus.Success
                          ? 'polite'
                          : undefined
                }
            >
                {label}
            </span>
        </button>
    );
};
