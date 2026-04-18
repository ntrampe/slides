import { useId, useState } from 'react';
import { ItemPicker } from '../../../shared/components/picker/ItemPicker';
import { SegmentedControl } from '../../../shared/components/SegmentedControl';
import { useLocationPicker } from '../hooks/useLocationPicker';
import type { LocationSelection } from '../types';

type LocationLevel = 'country' | 'state' | 'city';

interface LocationPickerProps {
    selection: LocationSelection;
    onChange: (selection: LocationSelection) => void;
    label: string;
}

export const LocationPicker = ({ selection, onChange, label }: LocationPickerProps) => {
    const [activeLevel, setActiveLevel] = useState<LocationLevel>('country');
    const tabsIdPrefix = useId();

    const {
        countryItems,
        stateItems,
        cityItems,
        selectedCountryIds,
        selectedStateIds,
        selectedCityIds,
        isLoading,
        error,
        handleCountryChange,
        handleStateChange,
        handleCityChange,
    } = useLocationPicker({ selection, onChange });

    const pickerProps =
        activeLevel === 'country'
            ? {
                  pickerLabel: 'Country' as const,
                  selectedIds: selectedCountryIds,
                  onChange: handleCountryChange,
                  items: countryItems,
                  searchPlaceholder: 'Search countries...',
              }
            : activeLevel === 'state'
              ? {
                    pickerLabel: 'State/Province' as const,
                    selectedIds: selectedStateIds,
                    onChange: handleStateChange,
                    items: stateItems,
                    searchPlaceholder: 'Search states/provinces...',
                }
              : {
                    pickerLabel: 'City' as const,
                    selectedIds: selectedCityIds,
                    onChange: handleCityChange,
                    items: cityItems,
                    searchPlaceholder: 'Search cities...',
                };

    return (
        <div className="space-y-4">
            <div>
                <span className="block mb-1 font-medium">{label}</span>
                <SegmentedControl<LocationLevel>
                    tabsIdPrefix={tabsIdPrefix}
                    semantics="tabs"
                    layout="stretch"
                    ariaLabel={`${label} level`}
                    value={activeLevel}
                    onChange={setActiveLevel}
                    options={[
                        { value: 'country', label: 'Country' },
                        { value: 'state', label: 'State' },
                        { value: 'city', label: 'City' },
                    ]}
                />
            </div>

            <div
                role="tabpanel"
                aria-labelledby={`${tabsIdPrefix}-${activeLevel}`}
            >
                <ItemPicker
                    key={activeLevel}
                    label=""
                    selectedIds={pickerProps.selectedIds}
                    onChange={pickerProps.onChange}
                    items={pickerProps.items}
                    selectionMode="single"
                    isLoading={isLoading}
                    error={error}
                    searchPlaceholder={pickerProps.searchPlaceholder}
                    emptyMessage=""
                />
            </div>
        </div>
    );
};
