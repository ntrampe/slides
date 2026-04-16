import type { SelectedItemsProps, PickerItem } from './types';
import { PickerItemChip } from './PickerItemChip';

export function SelectedItems<T extends PickerItem>({
    items,
    onRemove,
    onExclude,
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
                onExclude={onExclude ? () => onExclude(item.id) : undefined}
                onRemove={() => onRemove(item.id)}
                removeAriaLabel={`Clear ${item.label}`}
            />
        );
    }

    return (
        <div className="flex flex-wrap gap-2 mb-2">
            {items.map((item) => (
                <PickerItemChip
                    key={item.id}
                    item={item}
                    density="chip"
                    tone="included"
                    renderImage={renderImage}
                    renderLabel={renderLabel}
                    onExclude={onExclude ? () => onExclude(item.id) : undefined}
                    onRemove={() => onRemove(item.id)}
                    removeAriaLabel={`Remove ${item.label}`}
                />
            ))}
        </div>
    );
}
