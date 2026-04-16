import { useMemo } from 'react';
import { ItemPicker } from '../../../shared/components/picker/ItemPicker';
import { usePeople } from '../hooks/usePeople';
import type { PickerItem } from '../../../shared/components/picker/types';
import type { FilterOperator } from '../../photos/types';

interface PeoplePickerProps {
    selectedIds: string[];
    excludedIds?: string[];
    operator?: FilterOperator;
    onChange: (ids: string[]) => void;
    onExcludedChange?: (ids: string[]) => void;
    onOperatorChange?: (operator: FilterOperator) => void;
    label: string;
}

export const PeoplePicker = ({
    selectedIds,
    excludedIds = [],
    operator = 'AND',
    onChange,
    onExcludedChange,
    onOperatorChange,
    label
}: PeoplePickerProps) => {
    const { data: people, isLoading, error } = usePeople();

    // Map Person to PickerItem
    const pickerItems = useMemo<PickerItem[]>(() => {
        if (!people) return [];
        return people.map(person => ({
            id: person.id,
            label: person.name,
            imageUrl: person.thumbnailUrl,
        }));
    }, [people]);

    const handleToggleExclusion = (itemId: string) => {
        if (!onExcludedChange) return;

        if (excludedIds.includes(itemId)) {
            // Remove from excluded
            onExcludedChange(excludedIds.filter(id => id !== itemId));
        } else {
            // Add to excluded
            onExcludedChange([...excludedIds, itemId]);
        }
    };

    return (
        <ItemPicker
            label={label}
            selectedIds={selectedIds}
            excludedIds={excludedIds}
            operator={operator}
            onChange={onChange}
            onToggleExclusion={handleToggleExclusion}
            onOperatorChange={onOperatorChange}
            items={pickerItems}
            isLoading={isLoading}
            error={error}
            searchPlaceholder="Search people..."
            emptyMessage="No people selected. Leave empty to show all photos."
            operatorDescription={(op) =>
                `Include photos with ${op === 'AND' ? 'ALL' : 'ANY'} of these people`
            }
            renderImage={(item) => (
                item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt={item.label}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const sibling = e.currentTarget.nextElementSibling as HTMLElement;
                            if (sibling) sibling.classList.remove('hidden');
                        }}
                    />
                ) : null
            )}
        />
    );
};