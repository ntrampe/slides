import { format } from 'date-fns';
import { WeatherDisplay } from '../../weather';
import { useServices } from '../../../shared/context/ServiceContext';
import { useQuery } from '@tanstack/react-query';

export const Overlay = ({ progress }: { progress: number }) => {
    const { weather: weatherService } = useServices();

    const { data: weather } = useQuery({
        queryKey: ['weather'],
        queryFn: () => weatherService.getWeather(45.5, -73.5), // Example coordinates
        refetchInterval: 1000 * 60 * 15, // Update weather every 15 mins
    });

    return (
        <div className="absolute inset-0 p-12 flex flex-col justify-between pointer-events-none z-10">
            <div className="flex justify-between items-start">
                <div className="text-7xl font-light text-white drop-shadow-2xl">
                    {format(new Date(), 'HH:mm')}
                </div>
                <WeatherDisplay {...weather} />
            </div>

            {/* Timer Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <div
                    className="h-full bg-white transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};