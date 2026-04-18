import { useCallback, useState } from 'react';
import { useSettingsData } from './useSettingsData';

export interface UseWeatherCurrentLocationReturn {
    state: {
        locating: boolean;
        error: string | null;
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
    const [locating, setLocating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const requestLocation = useCallback(() => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            setError('Location is not available in this browser or context.');
            return;
        }
        setLocating(true);
        setError(null);
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
                setLocating(false);
            },
            (err) => {
                const messages: Record<number, string> = {
                    1: 'Location access was denied.',
                    2: 'Your position could not be determined.',
                    3: 'Location request timed out.'
                };
                setError(messages[err.code] ?? 'Could not get your location.');
                setLocating(false);
            },
            {
                enableHighAccuracy: false,
                maximumAge: 60_000,
                timeout: 15_000
            }
        );
    }, [updateSettings]);

    return {
        state: { locating, error },
        actions: { requestLocation }
    };
}
