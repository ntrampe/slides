import { useEffect } from 'react';

interface UseSlideshowKeyboardOptions {
    onPrevious: () => void;
    onNext: () => void;
    onTogglePlayPause: () => void;
    onReset: () => void;
}

export function useSlideshowKeyboard({
    onPrevious,
    onNext,
    onTogglePlayPause,
    onReset,
}: UseSlideshowKeyboardOptions) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                onPrevious();
                onReset();
            } else if (event.key === 'ArrowRight') {
                onNext();
                onReset();
            } else if (event.key === ' ' || event.key === 'Spacebar') {
                event.preventDefault();
                onTogglePlayPause();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onPrevious, onNext, onTogglePlayPause, onReset]);
}
