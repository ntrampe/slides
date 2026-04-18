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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-text-primary">
                    Combine albums and people
                </span>
                <FilterOperatorToggle
                    value={filter.globalOperator ?? DEFAULT_FILTER_OPERATOR}
                    onChange={onGlobalOperatorChange}
                />
            </div>
        );
    }

    return null;
};
