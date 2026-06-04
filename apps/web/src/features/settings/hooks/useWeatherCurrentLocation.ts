import { useCallback, useEffect, useState } from 'react';
import { useSettingsData } from './useSettingsData';

const TRANSIENT_STATUS_MS = 2500;

export const WeatherCurrentLocationStatus = {
    Idle: 'idle',
    Loading: 'loading',
    Success: 'success',
    Error: 'error'
} as const;

export type WeatherCurrentLocationStatus =
    (typeof WeatherCurrentLocationStatus)[keyof typeof WeatherCurrentLocationStatus];

export interface UseWeatherCurrentLocationReturn {
    state: {
        status: WeatherCurrentLocationStatus;
        /** Set when `status` is `Error`; cleared when leaving that state. */
        errorMessage: string | null;
    };
    actions: {
        requestLocation: () => void;
    };
}

/**
 * Reads the device position via the Geolocation API and persists
 * rounded coordinates into weather settings.
 */
export function useWeatherCurrentLocation(): UseWeatherCurrentLocationReturn {
    const { updateSettings } = useSettingsData();
    const [status, setStatus] = useState<WeatherCurrentLocationStatus>(
        WeatherCurrentLocationStatus.Idle
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (
            status !== WeatherCurrentLocationStatus.Success &&
            status !== WeatherCurrentLocationStatus.Error
        ) {
            return;
        }
        const t = window.setTimeout(() => {
            setStatus(WeatherCurrentLocationStatus.Idle);
            setErrorMessage(null);
        }, TRANSIENT_STATUS_MS);
        return () => window.clearTimeout(t);
    }, [status]);

    const requestLocation = useCallback(() => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            setErrorMessage(
                'Location is not available in this browser or context.'
            );
            setStatus(WeatherCurrentLocationStatus.Error);
            return;
        }
        setStatus(WeatherCurrentLocationStatus.Loading);
        setErrorMessage(null);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat =
                    Math.round(position.coords.latitude * 10000) / 10000;
                const lng =
                    Math.round(position.coords.longitude * 10000) / 10000;
                updateSettings({
                    weather: {
                        location: { lat, lng }
                    }
                });
                setStatus(WeatherCurrentLocationStatus.Success);
            },
            (err) => {
                const messages: Record<number, string> = {
                    1: 'Location access was denied.',
                    2: 'Your position could not be determined.',
                    3: 'Location request timed out.'
                };
                setErrorMessage(
                    messages[err.code] ?? 'Could not get your location.'
                );
                setStatus(WeatherCurrentLocationStatus.Error);
            },
            {
                enableHighAccuracy: false,
                maximumAge: 60_000,
                timeout: 15_000
            }
        );
    }, [updateSettings]);

    return {
        state: { status, errorMessage },
        actions: { requestLocation }
    };
}
