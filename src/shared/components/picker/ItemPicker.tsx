import { useState, useMemo, useCallback } from 'react';
import { SelectedItems } from './SelectedItems';
import { ExcludedItems } from './ExcludedItems';
import { SearchInput } from './SearchInput';
import { ItemDropdown } from './ItemDropdown';
import { FilterOperatorToggle } from './FilterOperatorToggle';
import type { PickerItem, ItemPickerProps } from './types';

export function ItemPicker<T extends PickerItem>({
    label,
    selectedIds,
    excludedIds = [],
    operator = 'AND',
    onChange,
    onExcludedChange,
    onBulkChange,
    onOperatorChange,
    items,
    isLoading,
    error,
    selectionMode = 'multiple',
    searchPlaceholder = "Search...",
    emptyMessage = "No items selected. Leave empty to show all.",
    noResultsMessage = "No items found",
    renderImage,
    renderLabel,
}: ItemPickerProps<T>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    if (!onBulkChange && !onChange) {
        throw new Error('ItemPicker requires onChange or onBulkChange');
    }

    const commitSelection = useCallback(
        (nextSelected: string[], nextExcluded: string[]) => {
            if (onBulkChange) {
                onBulkChange({ selectedIds: nextSelected, excludedIds: nextExcluded });
            } else {
                onChange!(nextSelected);
                const excludedUnchanged =
                    nextExcluded.length === excludedIds.length &&
                    nextExcluded.every((id, i) => id === excludedIds[i]);
                if (!excludedUnchanged) {
                    onExcludedChange?.(nextExcluded);
                }
            }
        },
        [onBulkChange, onChange, onExcludedChange, excludedIds]
    );

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return items;
        const query = searchQuery.toLowerCase();
        return items.filter(item =>
            item.label.toLowerCase().includes(query) ||
            item.subtitle?.toLowerCase().includes(query)
        );
    }, [items, searchQuery]);

    const selectedItems = useMemo(() => {
        return items.filter(item => selectedIds.includes(item.id));
    }, [items, selectedIds]);

    const availableItems = useMemo(() => {
        if (selectionMode === 'single') {
            return filteredItems;
        }
        return filteredItems.filter(item => !selectedIds.includes(item.id));
    }, [filteredItems, selectedIds, selectionMode]);

    const handleRemove = (itemId: string) => {
        commitSelection(
            selectedIds.filter(id => id !== itemId),
            excludedIds.filter(id => id !== itemId)
        );
    };

    const handleRemoveExcluded = (itemId: string) => {
        commitSelection(selectedIds, excludedIds.filter(id => id !== itemId));
    };

    const handleSelect = (itemId: string) => {
        const nextSelected =
            selectionMode === 'single' ? [itemId] : [...selectedIds, itemId];
        const nextExcluded = excludedIds.filter(id => id !== itemId);
        commitSelection(nextSelected, nextExcluded);
        setSearchQuery('');
    };

    const handleExcludeFromDropdown = useCallback(
        (itemId: string) => {
            if (excludedIds.includes(itemId)) return;
            commitSelection(selectedIds, [...excludedIds, itemId]);
            setSearchQuery('');
        },
        [commitSelection, selectedIds, excludedIds]
    );

    const exclusionEnabled = Boolean(onBulkChange || onExcludedChange);

    if (error) {
        return (
            <div className="mb-4">
                <span className="block mb-2 text-error">{label} (Error loading)</span>
                <p className="text-sm text-error">Failed to load items</p>
            </div>
        );
    }

    return (
        <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
                <span className="font-medium">{label}</span>
                {selectionMode === 'multiple' && selectedIds.length > 1 && onOperatorChange && (
                    <FilterOperatorToggle value={operator} onChange={onOperatorChange} />
                )}
            </div>

            <SelectedItems
                items={selectedItems}
                onRemove={handleRemove}
                selectionMode={selectionMode}
                renderImage={renderImage}
                renderLabel={renderLabel}
            />

            {exclusionEnabled && (
                <ExcludedItems
                    excludedIds={excludedIds}
                    items={items}
                    onRemoveExcluded={handleRemoveExcluded}
                    renderImage={renderImage}
                    renderLabel={renderLabel}
                />
            )}

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
                        excludedIds={excludedIds}
                        selectionMode={selectionMode}
                        onSelect={handleSelect}
                        onExclude={
                            exclusionEnabled && selectionMode === 'multiple'
                                ? handleExcludeFromDropdown
                                : undefined
                        }
                        onClose={() => setIsDropdownOpen(false)}
                        noResultsMessage={searchQuery ? noResultsMessage : 'All items selected'}
                        renderImage={renderImage}
                        renderLabel={renderLabel}
                    />
                )}
            </div>

            {selectionMode === 'single' && selectedIds.length === 0 && emptyMessage && (
                <p className="text-xs text-text-tertiary mt-1">{emptyMessage}</p>
            )}
        </div>
    );
}
