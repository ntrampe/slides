import { hudTextSizes } from '../../../shared/components';
import { AuthError, NetworkError, NotFoundError, ServerError } from '../../photos';

interface SlideshowErrorContentProps {
    error?: Error | null;
    onRetry?: () => void;
    onToggleSettings: () => void;
}

export const SlideshowErrorContent = ({
    error,
    onRetry,
    onToggleSettings
}: SlideshowErrorContentProps) => {
    let title = "Something went wrong";
    let message = error?.message ?? "Unable to load slideshow photos.";
    let showRetry = true;
    let showSettings = true;
    let buttonText = "Adjust Filters";

    if (error instanceof NetworkError) {
        title = "Connection Issue";
        showRetry = true;
        showSettings = false;
    } else if (error instanceof AuthError) {
        title = "Authentication Required";
        message = "Check your API key in settings.";
        showRetry = false;
        buttonText = "Update Settings";
    } else if (error instanceof NotFoundError) {
        title = "No Photos Found";
        message = "Selected filters returned no photos.";
        showRetry = false;
    } else if (error instanceof ServerError) {
        title = "Service Unavailable";
        message = "The photo service is temporarily unavailable.";
        showRetry = true;
        showSettings = false;
    }

    return (
        <div className="text-center max-w-md">
            <div className={`mb-3 text-red-500 ${hudTextSizes.heading}`}>
                {title}
            </div>

            <div className={`opacity-70 mb-6 ${hudTextSizes.caption}`}>
                {message}
            </div>

            <div className="flex gap-3 justify-center">
                {showRetry && onRetry && (
                    <button
                        onClick={onRetry}
                        className="px-4 py-2 bg-white text-black rounded"
                    >
                        Retry
                    </button>
                )}

                {showSettings && (
                    <button
                        onClick={onToggleSettings}
                        className="px-4 py-2 border border-white rounded"
                    >
                        {buttonText}
                    </button>
                )}
            </div>
        </div>
    );
};