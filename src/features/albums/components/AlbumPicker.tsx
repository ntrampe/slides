import { useMemo } from 'react';
import { ItemPicker } from '../../../shared/components/picker/ItemPicker';
import { pickerSubtitleLabel, renderImmichThumbnail } from '../../../shared/components/picker/pickerRenderers';
import { useAlbums } from '../hooks/useAlbums';
import type { PickerItem, PickerSelectionState } from '../../../shared/components/picker/types';
import type { FilterOperator } from '../../photos/types';

interface AlbumPickerProps {
    selectedIds: string[];
    excludedIds?: string[];
    operator?: FilterOperator;
    onBulkChange: (next: PickerSelectionState) => void;
    onOperatorChange?: (operator: FilterOperator) => void;
    label: string;
}

export const AlbumPicker = ({
    selectedIds,
    excludedIds = [],
    operator = 'AND',
    onBulkChange,
    onOperatorChange,
    label
}: AlbumPickerProps) => {
    const { data: albums, isLoading, error } = useAlbums();

    const pickerItems = useMemo<PickerItem[]>(() => {
        if (!albums) return [];
        return albums.map(album => ({
            id: album.id,
            label: album.name,
            imageUrl: album.thumbnailUrl,
            subtitle: `${album.assetCount} photo${album.assetCount !== 1 ? 's' : ''}`,
        }));
    }, [albums]);

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
            searchPlaceholder="Search albums..."
            renderImage={(item) => renderImmichThumbnail(item, 'album')}
            renderLabel={pickerSubtitleLabel}
        />
    );
};
