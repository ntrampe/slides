import { useEffect, useRef } from 'react';
import type { ItemDropdownProps, PickerItem } from './types';

export function ItemDropdown<T extends PickerItem>({
    items,
    selectedIds = [],
    excludedIds = [],
    selectionMode = 'multiple',
    onSelect,
    onExclude,
    onClose,
    noResultsMessage,
    renderImage,
    renderLabel,
}: ItemDropdownProps<T>) {
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle clicks outside dropdown and keyboard events
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        // Add event listeners for mouse, touch, and keyboard events
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside, { passive: true });
        document.addEventListener('keydown', handleKeyDown);

        // Cleanup event listeners
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <>
            {/* Dropdown content */}
            <div
                ref={dropdownRef}
                className="absolute z-20 w-full mt-1 bg-surface border border-border rounded max-h-64 overflow-y-auto"
            >
                {items.length === 0 ? (
                    <div className="p-3 text-sm text-text-tertiary">
                        {noResultsMessage}
                    </div>
                ) : (
                    items.map(item => {
                        const isSelected = selectedIds.includes(item.id);
                        const isExcluded = excludedIds.includes(item.id);
                        return (
                            <div
                                key={item.id}
                                className="flex items-stretch border-b border-border/50 last:border-b-0"
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        onSelect(item.id);
                                        if (selectionMode === 'single') {
                                            onClose();
                                        }
                                    }}
                                    className={`min-w-0 flex-1 flex items-center gap-2 p-2 hover:bg-surface-hover text-left ${
                                        isSelected && selectionMode === 'single'
                                            ? 'bg-primary-500/10 text-primary-500'
                                            : 'text-text-primary'
                                    }`}
                                >
                                    {renderImage && (
                                        <div className="flex-shrink-0">
                                            {renderImage(item)}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        {renderLabel ? renderLabel(item) : item.label}
                                    </div>
                                </button>
                                {onExclude && (
                                    <button
                                        type="button"
                                        disabled={isExcluded}
                                        title={
                                            isExcluded
                                                ? 'Already excluded — choose this row to include again'
                                                : 'Exclude from slideshow without selecting'
                                        }
                                        className={`flex-shrink-0 px-2.5 text-xs font-medium border-l border-border/50 transition-colors ${
                                            isExcluded
                                                ? 'text-text-tertiary cursor-not-allowed bg-surface'
                                                : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                                        }`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (isExcluded) return;
                                            onExclude(item.id);
                                        }}
                                    >
                                        {isExcluded ? 'Out' : 'Exclude'}
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}
