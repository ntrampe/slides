import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';
import type { Photo } from '../types';
import { useSettingsData } from '../../settings/hooks/useSettingsData';

interface PhotoMetadataOverlayProps {
    createdAt?: Photo['createdAt'];
    location?: Photo['location'];
}

export const PhotoMetadataOverlay = ({ createdAt, location }: PhotoMetadataOverlayProps) => {
    const { settings } = useSettingsData();

    if (!createdAt && !location) return null;

    return (
        <div className="absolute bottom-6 left-6 bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/5 text-white">
            {createdAt && (
                <div className="mb-4 flex items-center gap-3">
                    <Calendar className="w-6 h-6 opacity-60" />
                    <p className="text-2xl font-medium">
                        {format(new Date(createdAt), settings.photo.dateFormat)}
                    </p>
                </div>
            )}
            {location && (
                <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 opacity-60" />
                    <h2 className="text-2xl font-medium">{location}</h2>
                </div>
            )}
        </div>
    );
};