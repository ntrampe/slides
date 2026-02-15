import { format } from 'date-fns';
import { WeatherDisplay } from '../../weather';
import { useServices } from '../../../shared/context/ServiceContext';
import { useQuery } from '@tanstack/react-query';
import { useSettingsData } from '../../settings/hooks/useSettingsData';

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
        <div className="absolute inset-0 p-12 flex flex-col justify-between pointer-events-none z-10">
            <div className="flex justify-between items-start">
                {settings.clock.enabled &&
                    <div className="flex flex-col">
                        <div className="text-7xl font-light text-white drop-shadow-2xl">
                            {format(now, timeFormat)}
                        </div>
                        <div className="text-2xl font-light text-white/80 drop-shadow-2xl mt-2">
                            {format(now, settings.clock.dateFormat)}
                        </div>
                    </div>
                }
                {settings.weather.enabled &&
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