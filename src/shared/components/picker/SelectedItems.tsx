import { X } from 'lucide-react';
import type { SelectedItemsProps, PickerItem } from './types';

export function SelectedItems<T extends PickerItem>({
    items,
    onRemove,
    renderImage,
    renderLabel,
}: SelectedItemsProps<T>) {
    if (items.length === 0) return null;

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
