import { useState, useMemo } from 'react';
import { SelectedItems } from './SelectedItems';
import { SearchInput } from './SearchInput';
import { ItemDropdown } from './ItemDropdown';
import type { PickerItem, ItemPickerProps } from './types';

export function ItemPicker<T extends PickerItem>({
    label,
    selectedIds,
    excludedIds = [],
    operator = 'AND',
    onChange,
    onToggleExclusion,
    onOperatorChange,
    items,
    isLoading,
    error,
    selectionMode = 'multiple',
    searchPlaceholder = "Search...",
    emptyMessage = "No items selected. Leave empty to show all.",
    noResultsMessage = "No items found",
    operatorDescription,
    renderImage,
    renderLabel,
}: ItemPickerProps<T>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Filter items based on search query
    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return items;
        const query = searchQuery.toLowerCase();
        return items.filter(item =>
            item.label.toLowerCase().includes(query) ||
            item.subtitle?.toLowerCase().includes(query)
        );
    }, [items, searchQuery]);

    // Get selected items
    const selectedItems = useMemo(() => {
        return items.filter(item => selectedIds.includes(item.id));
    }, [items, selectedIds]);

    // Available items
    const availableItems = useMemo(() => {
        if (selectionMode === 'single') {
            // In single mode, show all filtered items (user can replace selection)
            return filteredItems;
        }
        // In multiple mode, hide already selected items
        return filteredItems.filter(item => !selectedIds.includes(item.id));
    }, [filteredItems, selectedIds, selectionMode]);

    const handleRemove = (itemId: string) => {
        onChange(selectedIds.filter(id => id !== itemId));
    };

    const handleSelect = (itemId: string) => {
        if (selectionMode === 'single') {
            // Replace selection
            onChange([itemId]);
        } else {
            // Add to selection
            onChange([...selectedIds, itemId]);
        }
        setSearchQuery('');
    };

    if (error) {
        return (
            <div className="mb-4">
                <span className="block mb-2 text-error">{label} (Error loading)</span>
                <p className="text-sm text-error">Failed to load items</p>
            </div>
        );
    }

    return (
        <div className="mb-4">
            {/* Header with label and operator toggle */}
            <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{label}</span>
                {selectionMode === 'multiple' && selectedIds.length > 0 && onOperatorChange && (
                    <div className="flex gap-1 text-xs">
                        <button
                            className={`px-2 py-1 rounded transition-colors ${operator === 'AND'
                                ? 'bg-primary-500 text-white'
                                : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
                                }`}
                            onClick={() => onOperatorChange('AND')}
                            title="Photos must be in ALL selected items"
                        >
                            ALL
                        </button>
                        <button
                            className={`px-2 py-1 rounded transition-colors ${operator === 'OR'
                                ? 'bg-primary-500 text-white'
                                : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
                                }`}
                            onClick={() => onOperatorChange('OR')}
                            title="Photos can be in ANY of the selected items"
                        >
                            ANY
                        </button>
                    </div>
                )}
            </div>

            {/* Operator description */}
            {selectionMode === 'multiple' && selectedIds.length > 0 && operatorDescription && (
                <p className="text-xs text-text-secondary mb-2">
                    {operatorDescription(operator)}
                </p>
            )}

            <SelectedItems
                items={selectedItems}
                excludedIds={excludedIds}
                onRemove={handleRemove}
                onToggleExclusion={onToggleExclusion}
                selectionMode={selectionMode}
                renderImage={renderImage}
                renderLabel={renderLabel}
            />

            <div className="relative">
                <SearchInput
                    value={searchQuery}
                    onChange={(value) => {
                        setSearchQuery(value);
                        setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder={isLoading ? "Loading..." : searchPlaceholder}
                    disabled={isLoading}
                />

                {isDropdownOpen && !isLoading && (
                    <ItemDropdown
                        items={availableItems}
                        selectedIds={selectedIds}
                        selectionMode={selectionMode}
                        onSelect={handleSelect}
                        onClose={() => setIsDropdownOpen(false)}
                        noResultsMessage={searchQuery ? noResultsMessage : 'All items selected'}
                        renderImage={renderImage}
                        renderLabel={renderLabel}
                    />
                )}
            </div>

            {selectedIds.length === 0 && (
                <p className="text-xs text-text-tertiary mt-1">{emptyMessage}</p>
            )}
        </div>
    );
}
