import { X } from 'lucide-react';
import type { SelectedItemsProps, PickerItem } from './types';

export function SelectedItems<T extends PickerItem>({
    items,
    onRemove,
    selectionMode = 'multiple',
    renderImage,
    renderLabel,
}: SelectedItemsProps<T>) {
    if (items.length === 0) return null;

    // Single selection mode: show as a single bordered item
    if (selectionMode === 'single' && items.length > 0) {
        const item = items[0];
        return (
            <div className="mb-2">
                <div className="flex items-center gap-2 bg-surface border border-border px-3 py-2 rounded text-sm text-text-primary">
                    {renderImage && (
                        <div className="flex-shrink-0">
                            {renderImage(item)}
                        </div>
                    )}
                    <span className="flex-1">
                        {renderLabel ? renderLabel(item) : item.label}
                    </span>
                    <button
                        onClick={() => onRemove(item.id)}
                        className="hover:bg-surface-hover rounded p-1 flex-shrink-0 text-text-tertiary hover:text-text-primary"
                        aria-label={`Clear ${item.label}`}
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        );
    }

    // Multiple selection mode: show as chips
    return (
        <div className="flex flex-wrap gap-2 mb-2">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center gap-2 bg-surface-hover px-2 py-1 rounded text-sm text-text-primary"
                >
                    {renderImage && (
                        <div className="flex-shrink-0">
                            {renderImage(item)}
                        </div>
                    )}
                    <span className="flex-1">
                        {renderLabel ? renderLabel(item) : item.label}
                    </span>
                    <button
                        onClick={() => onRemove(item.id)}
                        className="hover:bg-surface rounded p-0.5 flex-shrink-0"
                        aria-label={`Remove ${item.label}`}
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
    );
}
