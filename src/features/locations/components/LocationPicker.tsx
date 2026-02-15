import { ItemPicker } from '../../../shared/components/picker/ItemPicker';
import { useLocationPicker } from '../hooks/useLocationPicker';
import type { LocationSelection } from '../types';

interface LocationPickerProps {
    selection: LocationSelection;
    onChange: (selection: LocationSelection) => void;
    label: string;
}

export const LocationPicker = ({ selection, onChange, label }: LocationPickerProps) => {
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

    return (
        <div className="space-y-4">
            {/* Country Picker */}
            <ItemPicker
                label="Country"
                selectedIds={selectedCountryIds}
                onChange={handleCountryChange}
                items={countryItems}
                selectionMode="single"
                isLoading={isLoading}
                error={error}
                searchPlaceholder="Search countries..."
                emptyMessage="No country selected."
                renderLabel={(item) => (
                    <div>
                        <div>{item.label}</div>
                        {item.subtitle && (
                            <div className="text-xs text-text-tertiary">{item.subtitle}</div>
                        )}
                    </div>
                )}
            />

            {/* State/Province Picker */}
            <ItemPicker
                label="State/Province"
                selectedIds={selectedStateIds}
                onChange={handleStateChange}
                items={stateItems}
                selectionMode="single"
                isLoading={isLoading}
                error={error}
                searchPlaceholder="Search states/provinces..."
                emptyMessage={selection.country ? "No state/province selected." : "Select a country first to see states/provinces."}
                renderLabel={(item) => (
                    <div>
                        <div>{item.label}</div>
                        {item.subtitle && (
                            <div className="text-xs text-text-tertiary">{item.subtitle}</div>
                        )}
                    </div>
                )}
            />

            {/* City Picker */}
            <ItemPicker
                label="City"
                selectedIds={selectedCityIds}
                onChange={handleCityChange}
                items={cityItems}
                selectionMode="single"
                isLoading={isLoading}
                error={error}
                searchPlaceholder="Search cities..."
                emptyMessage={selection.state ? "No city selected." : "Select a state/province first to see cities."}
                renderLabel={(item) => (
                    <div>
                        <div>{item.label}</div>
                        {item.subtitle && (
                            <div className="text-xs text-text-tertiary">{item.subtitle}</div>
                        )}
                    </div>
                )}
            />
        </div>
    );
};