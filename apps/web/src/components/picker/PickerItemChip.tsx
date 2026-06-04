import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import type { PickerItem } from './types';

export type PickerChipDensity = 'single' | 'chip';

interface PickerItemChipProps<T extends PickerItem> {
    item: T;
    density: PickerChipDensity;
    tone: 'included' | 'excluded';
    renderImage?: (item: T) => ReactNode;
    renderLabel?: (item: T) => ReactNode;
    onRemove: () => void;
    removeAriaLabel: string;
}

export function PickerItemChip<T extends PickerItem>({
    item,
    density,
    tone,
    renderImage,
    renderLabel,
    onRemove,
    removeAriaLabel,
}: PickerItemChipProps<T>) {
    const isSingle = density === 'single';
    const xSize = isSingle ? 16 : 14;

    const includedShell =
        tone === 'included'
            ? isSingle
                ? 'bg-surface border border-border text-text-primary'
                : 'bg-surface-hover text-text-primary'
            : 'bg-error/10 border border-error/30 text-text-secondary';

    const inner = (
        <>
            {renderImage && <div className="flex-shrink-0">{renderImage(item)}</div>}
            <span className="flex-1">{renderLabel ? renderLabel(item) : item.label}</span>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                className={`flex-shrink-0 text-text-tertiary hover:text-text-primary ${isSingle ? 'hover:bg-surface-hover rounded p-1' : 'hover:bg-surface rounded p-0.5'}`}
                aria-label={removeAriaLabel}
            >
                <X size={xSize} />
            </button>
        </>
    );

    if (isSingle) {
        return (
            <div className="mb-2">
                <div className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${includedShell}`}>
                    {inner}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-2 px-2 py-1 rounded text-sm transition-colors ${includedShell}`}>
            {inner}
        </div>
    );
}
