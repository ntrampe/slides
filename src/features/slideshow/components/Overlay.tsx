import { format } from 'date-fns';
import { WeatherDisplay } from '../../weather';
import { useServices } from '../../../shared/context/ServiceContext';
import { useQuery } from '@tanstack/react-query';
import { useSettingsData } from '../../settings/hooks/useSettingsData';
import { HudPanel, hudTextSizes } from '../../../shared/components';

export const Overlay = ({ progress }: { progress: number }) => {
    const { weather: weatherService } = useServices();
    const { settings } = useSettingsData();

    const { data: weather } = useQuery({
        queryKey: ['weather'],
        queryFn: () => weatherService.getWeather(settings.weather.location.lat, settings.weather.location.lng),
        refetchInterval: 1000 * 60 * 15, // Update weather every 15 mins
    });

    const timeFormat = settings.clock.use24HourFormat ? 'HH:mm' : 'h:mm a';
    const now = new Date();

    return (
        <div className="absolute inset-0 p-4 sm:p-8 md:p-12 flex flex-col justify-between pointer-events-none z-10">
            <div className="flex justify-between items-start gap-4 flex-wrap">
                {settings.clock.enabled &&
                    <HudPanel variant="subtle">
                        <div className={`font-light ${hudTextSizes.display}`}>
                            {format(now, timeFormat)}
                        </div>
                        <div className={`font-light opacity-80 mt-1 sm:mt-2 ${hudTextSizes.heading}`}>
                            {format(now, settings.clock.dateFormat)}
                        </div>
                    </HudPanel>
                }
                {settings.weather.enabled && weather &&
                    <WeatherDisplay {...weather} />
                }
            </div>

            {/* Timer Progress Bar */}
            {settings.slideshow.ui.showProgressBar &&
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                    <div
                        className="h-full bg-white transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            }
        </div>
    );
};