import type { ReactNode } from 'react';
import type { FilterOperator } from '../../../features/photos/types';

export type SelectionMode = 'single' | 'multiple';

export interface PickerItem {
    id: string;
    label: string;
    imageUrl?: string;
    subtitle?: string;
}

export interface ItemPickerProps<T extends PickerItem> {
    label: string;
    selectedIds: string[];
    excludedIds?: string[];
    operator?: FilterOperator;
    onChange: (ids: string[]) => void;
    onToggleExclusion?: (id: string) => void;
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
    excludedIds?: string[];
    onRemove: (id: string) => void;
    onToggleExclusion?: (id: string) => void;
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
    selectionMode?: SelectionMode;
    onSelect: (id: string) => void;
    onClose: () => void;
    noResultsMessage: string;
    renderImage?: (item: T) => ReactNode;
    renderLabel?: (item: T) => ReactNode;
}
