import { FilterOperatorToggle } from '../../../shared/components/picker/FilterOperatorToggle';
import { DEFAULT_FILTER_OPERATOR } from '../../photos';
import type { FilterOperator, PhotoFilterParams } from '../../photos/types';

export interface SlideshowFilterCombineControlProps {
    filter: PhotoFilterParams;
    onGlobalOperatorChange: (globalOperator: FilterOperator) => void;
}

export const SlideshowFilterCombineControl = ({
    filter,
    onGlobalOperatorChange,
}: SlideshowFilterCombineControlProps) => {
    const albumCount = filter.albumIds?.length ?? 0;
    const personCount = filter.personIds?.length ?? 0;
    const showGlobalCombine = albumCount > 0 && personCount > 0;

    if (showGlobalCombine) {
        return (
            <div className="mb-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-1">
                    <span className="text-sm text-text-primary">
                        Combine album and people rules
                    </span>
                    <FilterOperatorToggle
                        value={filter.globalOperator ?? DEFAULT_FILTER_OPERATOR}
                        onChange={onGlobalOperatorChange}
                    />
                </div>
                <p className="text-xs text-text-secondary mb-3">
                    {(filter.globalOperator ?? DEFAULT_FILTER_OPERATOR) === 'AND'
                        ? 'Album rules and people rules must both match the same photo.'
                        : 'A photo can match either album rules or people rules (or both).'}
                </p>
            </div>
        );
    }

    if (albumCount > 0 && personCount === 0) {
        return (
            <div className="mb-4">
                <p className="text-xs text-text-tertiary mb-3">
                    Add at least one person to choose how album and people rules combine.
                </p>
            </div>
        );
    }

    if (personCount > 0 && albumCount === 0) {
        return (
            <div className="mb-4">
                <p className="text-xs text-text-tertiary mb-3">
                    Add at least one album to choose how album and people rules combine.
                </p>
            </div>
        );
    }

    return null;
};
