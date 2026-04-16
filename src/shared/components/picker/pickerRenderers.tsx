import type { ReactNode } from 'react';
import type { PickerItem } from './types';

export type ImmichThumbnailVariant = 'album' | 'person';

const thumbnailClass: Record<ImmichThumbnailVariant, string> = {
    album: 'w-10 h-10 rounded object-cover',
    person: 'w-8 h-8 rounded-full object-cover',
};

export function renderImmichThumbnail(item: PickerItem, variant: ImmichThumbnailVariant): ReactNode {
    if (!item.imageUrl) return null;
    return (
        <img
            src={item.imageUrl}
            alt={item.label}
            className={thumbnailClass[variant]}
            onError={(e) => {
                e.currentTarget.style.display = 'none';
                const sibling = e.currentTarget.nextElementSibling as HTMLElement;
                if (sibling) sibling.classList.remove('hidden');
            }}
        />
    );
}

export function pickerSubtitleLabel(item: PickerItem): ReactNode {
    return (
        <div>
            <div>{item.label}</div>
            {item.subtitle && <div className="text-xs text-text-tertiary">{item.subtitle}</div>}
        </div>
    );
}
