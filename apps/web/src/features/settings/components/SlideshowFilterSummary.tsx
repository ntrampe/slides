import type { QuerySettings } from '../../photos/types';
import { describeSlideshowFilter } from '../utils/describeSlideshowFilter';

export interface SlideshowFilterSummaryProps {
    query: QuerySettings;
}

export const SlideshowFilterSummary = ({ query }: SlideshowFilterSummaryProps) => {
    const filterSummaryLines = describeSlideshowFilter(query);

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
