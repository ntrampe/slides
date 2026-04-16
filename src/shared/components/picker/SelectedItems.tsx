import { X, Minus } from 'lucide-react';
import type { SelectedItemsProps, PickerItem } from './types';

export function SelectedItems<T extends PickerItem>({
    items,
    excludedIds = [],
    onRemove,
    onToggleExclusion,
    selectionMode = 'multiple',
    renderImage,
    renderLabel,
}: SelectedItemsProps<T>) {
    if (items.length === 0) return null;

    // Single selection mode: show as a single bordered item
    if (selectionMode === 'single' && items.length > 0) {
        const item = items[0];
        const isExcluded = excludedIds.includes(item.id);
        return (
            <div className="mb-2">
                <div className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${isExcluded
                        ? 'bg-error/10 border border-error/30 text-text-secondary line-through'
                        : 'bg-surface border border-border text-text-primary'
                    }`}>
                    {renderImage && (
                        <div className="flex-shrink-0">
                            {renderImage(item)}
                        </div>
                    )}
                    <span className="flex-1">
                        {renderLabel ? renderLabel(item) : item.label}
                    </span>
                    {onToggleExclusion && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleExclusion(item.id);
                            }}
                            className="hover:bg-surface rounded p-1 flex-shrink-0 transition-transform hover:scale-110"
                            title={isExcluded ? "Include this item" : "Exclude this item"}
                            aria-label={isExcluded ? `Include ${item.label}` : `Exclude ${item.label}`}
                        >
                            <Minus size={14} className={isExcluded ? 'text-error' : 'text-text-tertiary'} />
                        </button>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(item.id);
                        }}
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
            {items.map((item) => {
                const isExcluded = excludedIds.includes(item.id);
                return (
                    <div
                        key={item.id}
                        className={`flex items-center gap-2 px-2 py-1 rounded text-sm transition-colors ${isExcluded
                                ? 'bg-error/10 border border-error/30 text-text-secondary line-through'
                                : 'bg-surface-hover text-text-primary'
                            }`}
                    >
                        {renderImage && (
                            <div className="flex-shrink-0">
                                {renderImage(item)}
                            </div>
                        )}
                        <span className="flex-1">
                            {renderLabel ? renderLabel(item) : item.label}
                        </span>
                        {onToggleExclusion && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleExclusion(item.id);
                                }}
                                className="hover:bg-surface rounded p-0.5 flex-shrink-0 transition-transform hover:scale-110"
                                title={isExcluded ? "Include this item" : "Exclude this item"}
                                aria-label={isExcluded ? `Include ${item.label}` : `Exclude ${item.label}`}
                            >
                                <Minus size={12} className={isExcluded ? 'text-error' : 'text-text-tertiary'} />
                            </button>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(item.id);
                            }}
                            className="hover:bg-surface rounded p-0.5 flex-shrink-0"
                            aria-label={`Remove ${item.label}`}
                        >
                            <X size={14} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
