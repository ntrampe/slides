import { useMemo } from 'react';
import { ItemPicker } from '../../../shared/components/picker/ItemPicker';
import { useAlbums } from '../hooks/useAlbums';
import type { PickerItem } from '../../../shared/components/picker/types';
import type { FilterOperator } from '../../photos/types';

interface AlbumPickerProps {
    selectedIds: string[];
    excludedIds?: string[];
    operator?: FilterOperator;
    onChange: (ids: string[]) => void;
    onExcludedChange?: (ids: string[]) => void;
    onOperatorChange?: (operator: FilterOperator) => void;
    label: string;
}

export const AlbumPicker = ({
    selectedIds,
    excludedIds = [],
    operator = 'OR',
    onChange,
    onExcludedChange,
    onOperatorChange,
    label
}: AlbumPickerProps) => {
    const { data: albums, isLoading, error } = useAlbums();

    // Map Album to PickerItem
    const pickerItems = useMemo<PickerItem[]>(() => {
        if (!albums) return [];
        return albums.map(album => ({
            id: album.id,
            label: album.name,
            imageUrl: album.thumbnailUrl,
            subtitle: `${album.assetCount} photo${album.assetCount !== 1 ? 's' : ''}`,
        }));
    }, [albums]);

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
            searchPlaceholder="Search albums..."
            emptyMessage="No albums selected. Leave empty to show all photos."
            operatorDescription={(op) =>
                `Include photos with ${op === 'AND' ? 'ALL' : 'ANY'} of these albums`
            }
            renderImage={(item) => (
                item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt={item.label}
                        className="w-10 h-10 rounded object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const sibling = e.currentTarget.nextElementSibling as HTMLElement;
                            if (sibling) sibling.classList.remove('hidden');
                        }}
                    />
                ) : null
            )}
            renderLabel={(item) => (
                <div>
                    <div>{item.label}</div>
                    {item.subtitle && (
                        <div className="text-xs text-text-tertiary">{item.subtitle}</div>
                    )}
                </div>
            )}
        />
    );
};
