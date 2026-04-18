import type { PhotoFilterParams } from '../../photos/types';
import { describeSlideshowFilter } from '../utils/describeSlideshowFilter';

export interface SlideshowFilterSummaryProps {
    filter: PhotoFilterParams;
}

export const SlideshowFilterSummary = ({ filter }: SlideshowFilterSummaryProps) => {
    const filterSummaryLines = describeSlideshowFilter(filter);

    return (
        <div className="space-y-2">
            <h3 className="text-xs font-semibold text-text-primary">
                What&apos;s in the slideshow
            </h3>
            <div
                className="text-xs text-text-secondary space-y-1"
                aria-live="polite"
            >
                {filterSummaryLines.map((line, i) => (
                    <p key={i}>{line}</p>
                ))}
            </div>
        </div>
    );
};
