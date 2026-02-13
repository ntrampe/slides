import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';
import type { Photo } from '../../photos';
import { WeatherDisplay } from '../../weather';
import { useServices } from '../../../shared/context/ServiceContext';
import { useQuery } from '@tanstack/react-query';

export const Overlay = ({ photo }: { photo?: Photo }) => {
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

            <div className="bg-black/20 backdrop-blur-md self-start p-6 rounded-2xl border border-white/5 text-white">
                {photo?.createdAt && (
                    <div className="mb-4 flex items-center gap-3">
                        <Calendar className="w-6 h-6 opacity-60" />
                        <p className="text-2xl font-medium">{format(new Date(photo.createdAt), 'MMMM d, yyyy')}</p>
                    </div>
                )}
                {photo?.location && (
                    <div className="flex items-center gap-3">
                        <MapPin className="w-6 h-6 opacity-60" />
                        <h2 className="text-2xl font-medium">{photo.location}</h2>
                    </div>
                )}
            </div>
        </div>
    );
};