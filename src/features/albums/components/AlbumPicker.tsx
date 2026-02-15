import { useMemo } from 'react';
import { ItemPicker } from '../../../shared/components/picker/ItemPicker';
import { useAlbums } from '../hooks/useAlbums';
import type { PickerItem } from '../../../shared/components/picker/types';

interface AlbumPickerProps {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    label: string;
}

export const AlbumPicker = ({ selectedIds, onChange, label }: AlbumPickerProps) => {
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

    return (
        <ItemPicker
            label={label}
            selectedIds={selectedIds}
            onChange={onChange}
            items={pickerItems}
            isLoading={isLoading}
            error={error}
            searchPlaceholder="Search albums..."
            emptyMessage="No albums selected. Leave empty to show all photos."
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
