import { Loader2 } from 'lucide-react';
import { hudTextSizes } from '../../../shared/components';
import { MediaDisplay } from '../../photos/components/MediaDisplay';
import { SlideshowErrorContent } from './SlideshowErrorContent';
import type { UseSlideshowReturn } from '../hooks/types';

type SlideshowState = UseSlideshowReturn['state'];

interface SlideshowContentProps {
    state: SlideshowState;
    onRetry: () => void;
    onToggleSettings: () => void;
}

const centeredShell = 'h-full w-full flex items-center justify-center text-white';

function SlideshowEmptyState() {
    return (
        <div className={centeredShell}>
            <div className="text-center max-w-md">
                <div className={`mb-3 ${hudTextSizes.heading}`}>No photos found</div>
                <div className={`opacity-60 ${hudTextSizes.caption}`}>
                    Try adjusting your filters or adding photos to your library.
                </div>
            </div>
        </div>
    );
}

function SlideshowMetadataLoading() {
    return (
        <div className={centeredShell}>
            <div
                role="status"
                aria-live="polite"
                className="flex flex-col items-center gap-5 text-center px-4 max-w-md"
            >
                <Loader2
                    className="h-12 w-12 shrink-0 animate-spin motion-reduce:animate-none opacity-90"
                    strokeWidth={1.5}
                    aria-hidden
                />
                <div>
                    <div className={hudTextSizes.heading}>Loading metadata…</div>
                    <div className={`mt-2 opacity-60 ${hudTextSizes.caption}`}>
                        Large libraries may take several minutes.
                    </div>
                </div>
            </div>
        </div>
    );
}

function SlideshowPhotoLoading({ currentIndex, count }: { currentIndex: number; count: number }) {
    return (
        <div className={centeredShell}>
            <div className="text-center">
                <div className={`mb-2 ${hudTextSizes.heading}`}>Loading photo…</div>
                <div className={`opacity-60 ${hudTextSizes.caption}`}>
                    {currentIndex + 1} / {count}
                </div>
            </div>
        </div>
    );
}

function SlideshowSlides({ state }: { state: SlideshowState }) {
    const { displayedPhoto, displayedNextPhoto, layoutClass, transitionStyles, objectFit } = state;
    if (!displayedPhoto) {
        return null;
    }

    return (
        <div
            className={`grid h-full w-full ${layoutClass}`}
            style={transitionStyles}
        >
            <MediaDisplay
                key={displayedPhoto.id}
                photo={displayedPhoto}
                objectFit={objectFit}
            />
            {layoutClass.includes('grid-cols-2') && displayedNextPhoto && (
                <MediaDisplay
                    key={displayedNextPhoto.id}
                    photo={displayedNextPhoto}
                    objectFit={objectFit}
                />
            )}
        </div>
    );
}

/**
 * Photo-layer UI for the slideshow: empty, error, loading, or active slides.
 * Matches the early-return / named-view pattern from project best practices.
 */
export function SlideshowContent({ state, onRetry, onToggleSettings }: SlideshowContentProps) {
    if (state.isEmpty) {
        return <SlideshowEmptyState />;
    }

    if (state.isError || state.error) {
        return (
            <div className={centeredShell}>
                <SlideshowErrorContent
                    error={state.error}
                    onRetry={onRetry}
                    onToggleSettings={onToggleSettings}
                />
            </div>
        );
    }

    if (state.isLoading) {
        return <SlideshowMetadataLoading />;
    }

    if (!state.currentPhoto || !state.displayedPhoto) {
        return (
            <SlideshowPhotoLoading currentIndex={state.currentIndex} count={state.count} />
        );
    }

    return <SlideshowSlides state={state} />;
}
