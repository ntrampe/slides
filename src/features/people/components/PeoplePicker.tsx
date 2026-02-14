import { useMemo } from 'react';
import { ItemPicker } from '../../../shared/components/picker/ItemPicker';
import { usePeople } from '../hooks/usePeople';
import type { PickerItem } from '../../../shared/components/picker/types';

interface PeoplePickerProps {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    label: string;
}

export const PeoplePicker = ({ selectedIds, onChange, label }: PeoplePickerProps) => {
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

    return (
        <ItemPicker
            label={label}
            selectedIds={selectedIds}
            onChange={onChange}
            items={pickerItems}
            isLoading={isLoading}
            error={error}
            searchPlaceholder="Search people..."
            emptyMessage="No people selected. Leave empty to show all photos."
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