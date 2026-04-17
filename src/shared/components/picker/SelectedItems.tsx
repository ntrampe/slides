import type { SelectedItemsProps, PickerItem } from './types';
import { PickerItemChip } from './PickerItemChip';

export function SelectedItems<T extends PickerItem>({
    items,
    onRemove,
    selectionMode = 'multiple',
    renderImage,
    renderLabel,
}: SelectedItemsProps<T>) {
    if (items.length === 0) return null;

    if (selectionMode === 'single' && items.length > 0) {
        const item = items[0];
        return (
            <PickerItemChip
                item={item}
                density="single"
                tone="included"
                renderImage={renderImage}
                renderLabel={renderLabel}
                onRemove={() => onRemove(item.id)}
                removeAriaLabel={`Clear ${item.label}`}
            />
        );
    }

    return (
        <div className="flex flex-wrap gap-1.5 mb-1.5">
            {items.map((item) => (
                <PickerItemChip
                    key={item.id}
                    item={item}
                    density="chip"
                    tone="included"
                    renderImage={renderImage}
                    renderLabel={renderLabel}
                    onRemove={() => onRemove(item.id)}
                    removeAriaLabel={`Remove ${item.label}`}
                />
            ))}
        </div>
    );
}
