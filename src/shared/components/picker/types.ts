import type { ReactNode } from 'react';
import type { FilterOperator } from '../../../features/photos/types';

export type SelectionMode = 'single' | 'multiple';

export interface PickerItem {
    id: string;
    label: string;
    imageUrl?: string;
    subtitle?: string;
}

export interface PickerSelectionState {
    selectedIds: string[];
    excludedIds: string[];
}

export interface ItemPickerProps<T extends PickerItem> {
    label: string;
    selectedIds: string[];
    excludedIds?: string[];
    operator?: FilterOperator;
    /**
     * Prefer this when selection and exclusions must persist together (e.g. settings deep-merge).
     * Avoids two sequential updates that each read the same stale saved snapshot.
     */
    onBulkChange?: (next: PickerSelectionState) => void;
    /** Used when `onBulkChange` is not set (e.g. location pickers). */
    onChange?: (ids: string[]) => void;
    onExcludedChange?: (ids: string[]) => void;
    onOperatorChange?: (operator: FilterOperator) => void;
    items: T[];
    isLoading: boolean;
    error: Error | null;
    selectionMode?: SelectionMode;
    searchPlaceholder?: string;
    emptyMessage?: string;
    noResultsMessage?: string;
    operatorDescription?: (operator: FilterOperator) => string;
    renderImage?: (item: T) => ReactNode;
    renderLabel?: (item: T) => ReactNode;
}

export interface SelectedItemsProps<T extends PickerItem> {
    items: T[];
    onRemove: (id: string) => void;
    onExclude?: (id: string) => void;
    selectionMode?: SelectionMode;
    renderImage?: (item: T) => ReactNode;
    renderLabel?: (item: T) => ReactNode;
}

export interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onFocus: () => void;
    placeholder: string;
    disabled: boolean;
}

export interface ItemDropdownProps<T extends PickerItem> {
    items: T[];
    selectedIds?: string[];
    excludedIds?: string[];
    selectionMode?: SelectionMode;
    onSelect: (id: string) => void;
    /** When set, each row shows an action to exclude without selecting (multi-select pickers). */
    onExclude?: (id: string) => void;
    onClose: () => void;
    noResultsMessage: string;
    renderImage?: (item: T) => ReactNode;
    renderLabel?: (item: T) => ReactNode;
}
