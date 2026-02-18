import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';
import type { Photo } from '../types';
import { useSettingsData } from '../../settings/hooks/useSettingsData';
import { HudPanel, hudTextSizes } from '../../../shared/components';

interface PhotoMetadataOverlayProps {
    createdAt?: Photo['createdAt'];
    location?: string;
}

export const PhotoMetadataOverlay = ({ createdAt, location }: PhotoMetadataOverlayProps) => {
    const { settings } = useSettingsData();

    if (!createdAt && !location) return null;

    return (
        <HudPanel
            variant="subtle"
            className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6"
        >
            {createdAt && (
                <div className={`flex items-center gap-2 sm:gap-3 ${location ? 'mb-1 sm:mb-2' : ''}`}>
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 opacity-60" />
                    <p className={`font-medium ${hudTextSizes.body}`}>
                        {format(new Date(createdAt), settings.photos.dateFormat)}
                    </p>
                </div>
            )}
            {location && (
                <div className="flex items-center gap-2 sm:gap-3">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 opacity-60" />
                    <h2 className={`font-medium ${hudTextSizes.body}`}>{location}</h2>
                </div>
            )}
        </HudPanel>
    );
};