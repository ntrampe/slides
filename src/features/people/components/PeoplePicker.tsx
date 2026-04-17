import { useMemo } from 'react';
import { ItemPicker } from '../../../shared/components/picker/ItemPicker';
import { pickerSubtitleLabel, renderImmichThumbnail } from '../../../shared/components/picker/pickerRenderers';
import { usePeople } from '../hooks/usePeople';
import type { PickerItem, PickerSelectionState } from '../../../shared/components/picker/types';
import type { FilterOperator } from '../../photos/types';

interface PeoplePickerProps {
    selectedIds: string[];
    excludedIds?: string[];
    operator?: FilterOperator;
    onBulkChange: (next: PickerSelectionState) => void;
    onOperatorChange?: (operator: FilterOperator) => void;
    label: string;
}

export const PeoplePicker = ({
    selectedIds,
    excludedIds = [],
    operator = 'AND',
    onBulkChange,
    onOperatorChange,
    label
}: PeoplePickerProps) => {
    const { data: people, isLoading, error } = usePeople();

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
            excludedIds={excludedIds}
            operator={operator}
            onBulkChange={onBulkChange}
            onOperatorChange={onOperatorChange}
            items={pickerItems}
            isLoading={isLoading}
            error={error}
            searchPlaceholder="Search people..."
            emptyMessage="No people selected. Leave empty to show all photos."
            renderImage={(item) => renderImmichThumbnail(item, 'person')}
            renderLabel={pickerSubtitleLabel}
        />
    );
};
