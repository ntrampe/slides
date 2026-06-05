import { FilterOperatorToggle } from '../../../components/picker/FilterOperatorToggle';
import type { FilterOperator, QuerySettings } from '../../photos/types';
import { DEFAULT_FILTER_OPERATOR } from '@slides/shared/constants';

export interface SlideshowFilterCombineControlProps {
    query: QuerySettings;
    onGlobalOperatorChange: (globalOperator: FilterOperator) => void;
}

export const SlideshowFilterCombineControl = ({
    query,
    onGlobalOperatorChange,
}: SlideshowFilterCombineControlProps) => {
    const albumCount = query.albumIds?.length ?? 0;
    const personCount = query.personIds?.length ?? 0;
    const showGlobalCombine = albumCount > 0 && personCount > 0;

    if (showGlobalCombine) {
        return (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-text-primary">
                    Combine albums and people
                </span>
                <FilterOperatorToggle
                    value={query.globalOperator ?? DEFAULT_FILTER_OPERATOR}
                    onChange={onGlobalOperatorChange}
                />
            </div>
        );
    }

    return null;
};
