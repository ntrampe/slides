import { useMemo } from 'react';
import { useLocationHierarchy } from './useLocationHierarchy';
import type { LocationSelection } from '../types';
import type { PickerItem } from '../../../shared/components/picker/types';

export interface UseLocationPickerReturn {
    // Data for each picker
    countryItems: PickerItem[];
    stateItems: PickerItem[];
    cityItems: PickerItem[];

    // Selection state
    selectedCountryIds: string[];
    selectedStateIds: string[];
    selectedCityIds: string[];

    // Loading/error state
    isLoading: boolean;
    error: Error | null;

    // Actions
    handleCountryChange: (ids: string[]) => void;
    handleStateChange: (ids: string[]) => void;
    handleCityChange: (ids: string[]) => void;
}

interface UseLocationPickerParams {
    selection: LocationSelection;
    onChange: (selection: LocationSelection) => void;
}

export const useLocationPicker = ({
    selection,
    onChange
}: UseLocationPickerParams): UseLocationPickerReturn => {
    const { data: hierarchy, isLoading: hierarchyLoading, error: hierarchyError } = useLocationHierarchy();

    // Get all countries
    const countryItems = useMemo<PickerItem[]>(() => {
        if (!hierarchy) return [];

        return hierarchy.countries.map(country => ({
            id: country.id,
            label: country.name,
            subtitle: `${country.count} location${country.count !== 1 ? 's' : ''}`,
        }));
    }, [hierarchy]);

    // Get ALL states (user can search any state and it will auto-resolve the country)
    const stateItems = useMemo<PickerItem[]>(() => {
        if (!hierarchy) return [];

        const allStates: PickerItem[] = [];
        Object.entries(hierarchy.states).forEach(([country, states]) => {
            states.forEach(state => {
                allStates.push({
                    id: state.id,
                    label: state.name,
                    subtitle: `${country} • ${state.count} location${state.count !== 1 ? 's' : ''}`,
                });
            });
        });
        return allStates.sort((a, b) => a.label.localeCompare(b.label));
    }, [hierarchy]);

    // Get ALL cities (user can search any city and it will auto-resolve state/country)
    const cityItems = useMemo<PickerItem[]>(() => {
        if (!hierarchy) return [];

        const allCities: PickerItem[] = [];
        Object.entries(hierarchy.cities).forEach(([state, cities]) => {
            cities.forEach(city => {
                // Find the country for this state
                let country = '';
                Object.entries(hierarchy.states).forEach(([countryName, states]) => {
                    if (states.some(s => s.name === state)) {
                        country = countryName;
                    }
                });

                allCities.push({
                    id: city.id,
                    label: city.name,
                    subtitle: `${state}, ${country} • ${city.count} location${city.count !== 1 ? 's' : ''}`,
                });
            });
        });
        return allCities.sort((a, b) => a.label.localeCompare(b.label));
    }, [hierarchy]);

    // Selected IDs for each picker
    const selectedCountryIds = selection.country ? [selection.country] : [];
    const selectedStateIds = selection.country && selection.state ? [`${selection.country}:${selection.state}`] : [];
    const selectedCityIds = selection.state && selection.city ? [`${selection.state}:${selection.city}`] : [];



    const handleCountryChange = (ids: string[]) => {
        const country = ids.length > 0 ? ids[0] : undefined;
        onChange({
            country,
            state: undefined,
            city: undefined
        });
    };

    const handleStateChange = async (ids: string[]) => {
        if (ids.length === 0) {
            onChange({
                ...selection,
                state: undefined,
                city: undefined
            });
            return;
        }

        const stateId = ids[0];
        const [country, state] = stateId.split(':');

        onChange({
            country,
            state,
            city: undefined
        });
    };

    const handleCityChange = async (ids: string[]) => {
        if (ids.length === 0) {
            onChange({
                ...selection,
                city: undefined
            });
            return;
        }

        const cityId = ids[0];
        const [state, city] = cityId.split(':');

        // Find the country for this state
        let country = '';
        if (hierarchy) {
            Object.entries(hierarchy.states).forEach(([countryName, states]) => {
                if (states.some(s => s.name === state)) {
                    country = countryName;
                }
            });
        }

        onChange({
            country,
            state,
            city
        });
    };

    return {
        countryItems,
        stateItems,
        cityItems,
        selectedCountryIds,
        selectedStateIds,
        selectedCityIds,
        isLoading: hierarchyLoading,
        error: hierarchyError,
        handleCountryChange,
        handleStateChange,
        handleCityChange,
    };
};