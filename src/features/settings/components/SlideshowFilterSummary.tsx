import type { PhotoFilterParams } from '../../photos/types';
import { describeSlideshowFilter } from '../utils/describeSlideshowFilter';

export interface SlideshowFilterSummaryProps {
    filter: PhotoFilterParams;
}

export const SlideshowFilterSummary = ({ filter }: SlideshowFilterSummaryProps) => {
    const filterSummaryLines = describeSlideshowFilter(filter);

    return (
        <div className="mb-4">
            <h3 className="text-xs font-semibold text-text-primary mb-2">
                What&apos;s in the slideshow
            </h3>
            <div
                className="rounded-lg border border-border/80 bg-surface px-3 py-2 text-xs text-text-secondary mb-3"
                aria-live="polite"
            >
                {filterSummaryLines.map((line, i) => (
                    <p key={i}>{line}</p>
                ))}
            </div>
        </div>
    );
};
