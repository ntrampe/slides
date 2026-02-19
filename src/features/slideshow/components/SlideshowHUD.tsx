import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Play, Pause, Settings } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { WeatherDisplay } from '../../weather';
import { useServices } from '../../../shared/context/ServiceContext';
import { useSettingsData } from '../../settings/hooks/useSettingsData';
import { HudButton, HudPanel, hudTextSizes } from '../../../shared/components';

interface SlideshowHUDProps {
    // State
    progress: number;
    isPlaying: boolean;
    areControlsVisible: boolean;

    // Actions
    onPrevious: () => void;
    onNext: () => void;
    onTogglePlayPause: () => void;
    onToggleSettings: () => void;
}

export const SlideshowHUD = ({
    progress,
    isPlaying,
    areControlsVisible,
    onPrevious,
    onNext,
    onTogglePlayPause,
    onToggleSettings,
}: SlideshowHUDProps) => {
    const { weather: weatherService } = useServices();
    const { settings } = useSettingsData();

    const { data: weather } = useQuery({
        queryKey: ['weather'],
        queryFn: () => weatherService.getWeather(settings.weather.location.lat, settings.weather.location.lng),
        refetchInterval: 1000 * 60 * 15, // Update weather every 15 mins
        enabled: settings.weather.enabled,
    });

    const timeFormat = settings.clock.use24HourFormat ? 'HH:mm' : 'h:mm a';
    const now = new Date();

    const controlsOpacity = areControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none';

    return (
        <div className="fixed inset-0 pointer-events-none z-10">
            {/* Top Row */}
            <div className="absolute top-4 left-0 right-0 px-4 sm:px-8 md:px-12 flex justify-between items-start gap-4 flex-wrap">
                {/* Top Left: Clock */}
                {settings.clock.enabled && (
                    <HudPanel variant="subtle" className="pointer-events-auto">
                        <div className={`font-light ${hudTextSizes.display}`}>
                            {format(now, timeFormat)}
                        </div>
                        <div className={`font-light opacity-80 mt-1 sm:mt-2 ${hudTextSizes.heading}`}>
                            {format(now, settings.clock.dateFormat)}
                        </div>
                    </HudPanel>
                )}

                {/* Top Right: Weather + Settings */}
                <div className="flex items-start gap-4">
                    {settings.weather.enabled && weather && (
                        <div className="pointer-events-auto">
                            <WeatherDisplay {...weather} />
                        </div>
                    )}

                    {areControlsVisible && (
                        <HudButton
                            onClick={onToggleSettings}
                            label="Settings"
                            size="medium"
                            className="pointer-events-auto transition-all duration-300"
                        >
                            <Settings strokeWidth={2} />
                        </HudButton>
                    )}
                </div>
            </div>

            {/* Center: Slideshow Controls */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${controlsOpacity}`}>
                <div className="flex items-center gap-4 pointer-events-auto">
                    <HudButton
                        onClick={onPrevious}
                        label="Previous photo"
                        size="large"
                    >
                        <ChevronLeft strokeWidth={2} />
                    </HudButton>

                    <HudButton
                        onClick={onTogglePlayPause}
                        label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                        size="large"
                        className="scale-110" // Make play/pause visually dominant
                    >
                        {isPlaying ? <Pause strokeWidth={2} /> : <Play strokeWidth={2} />}
                    </HudButton>

                    <HudButton
                        onClick={onNext}
                        label="Next photo"
                        size="large"
                    >
                        <ChevronRight strokeWidth={2} />
                    </HudButton>
                </div>
            </div>

            {/* Bottom Edge: Progress Bar */}
            {settings.slideshow.ui.showProgressBar && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 pointer-events-none">
                    <div
                        className="h-full bg-white transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
};