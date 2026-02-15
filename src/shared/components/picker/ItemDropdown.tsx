import type { ItemDropdownProps, PickerItem } from './types';

export function ItemDropdown<T extends PickerItem>({
    items,
    onSelect,
    onClose,
    noResultsMessage,
    renderImage,
    renderLabel,
}: ItemDropdownProps<T>) {
    return (
        <>
            {/* Backdrop to close dropdown */}
            <div
                className="fixed inset-0 z-10"
                onClick={onClose}
            />

            {/* Dropdown content */}
            <div className="absolute z-20 w-full mt-1 bg-surface border border-border rounded max-h-64 overflow-y-auto">
                {items.length === 0 ? (
                    <div className="p-3 text-sm text-text-tertiary">
                        {noResultsMessage}
                    </div>
                ) : (
                    items.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item.id)}
                            className="w-full flex items-center gap-2 p-2 hover:bg-surface-hover text-text-primary text-left"
                        >
                            {renderImage && (
                                <div className="flex-shrink-0">
                                    {renderImage(item)}
                                </div>
                            )}
                            <div className="flex-1">
                                {renderLabel ? renderLabel(item) : item.label}
                            </div>
                        </button>
                    ))
                )}
            </div>
        </>
    );
}
