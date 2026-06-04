import { useMemo } from 'react';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import type { PickerItem } from './types';
import { PickerItemChip } from './PickerItemChip';

export interface ExcludedItemsProps<T extends PickerItem> {
    excludedIds: string[];
    items: T[];
    onRemoveExcluded: (id: string) => void;
    renderImage?: (item: T) => ReactNode;
    renderLabel?: (item: T) => ReactNode;
}

export function ExcludedItems<T extends PickerItem>({
    excludedIds,
    items,
    onRemoveExcluded,
    renderImage,
    renderLabel,
}: ExcludedItemsProps<T>) {
    const itemById = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);

    if (excludedIds.length === 0) return null;

    return (
        <div className="mb-2 mt-0.5">
            <span className="block text-xs font-medium text-text-secondary mb-1">
                Excluded from slideshow
            </span>
            <div className="flex flex-wrap gap-1.5">
                {excludedIds.map((id) => {
                    const item = itemById.get(id);
                    if (!item) {
                        return (
                            <div
                                key={id}
                                className="flex items-center gap-2 px-2 py-1 rounded text-sm bg-error/10 border border-error/30 text-text-secondary"
                            >
                                <span className="flex-1 truncate" title={id}>
                                    Unknown item
                                </span>
                                <button
                                    type="button"
                                    className="hover:bg-surface rounded p-0.5 text-text-tertiary"
                                    onClick={() => onRemoveExcluded(id)}
                                    aria-label="Remove exclusion"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        );
                    }
                    return (
                        <PickerItemChip
                            key={id}
                            item={item}
                            density="chip"
                            tone="excluded"
                            renderImage={renderImage}
                            renderLabel={renderLabel}
                            onRemove={() => onRemoveExcluded(id)}
                            removeAriaLabel={`Remove exclusion for ${item.label}`}
                        />
                    );
                })}
            </div>
        </div>
    );
}
