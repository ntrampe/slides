import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';
import type { Photo } from '../types';

interface PhotoDisplayProps {
    photo: Photo;
}

export const PhotoDisplay = ({ photo }: PhotoDisplayProps) => {
    return (
        <div className={`relative h-full w-full overflow-hidden animate-in fade-in duration-1000`}>
            {/* Photo Image */}
            <img
                src={photo.url}
                alt={photo.description || 'Photo'}
                className="w-full h-full object-cover"
            />

            {/* Date & Location Metadata Overlay */}
            {(photo.createdAt || photo.location) && (
                <div className="absolute bottom-6 left-6 bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/5 text-white">
                    {photo.createdAt && (
                        <div className="mb-4 flex items-center gap-3">
                            <Calendar className="w-6 h-6 opacity-60" />
                            <p className="text-2xl font-medium">
                                {format(new Date(photo.createdAt), 'MMMM d, yyyy')}
                            </p>
                        </div>
                    )}
                    {photo.location && (
                        <div className="flex items-center gap-3">
                            <MapPin className="w-6 h-6 opacity-60" />
                            <h2 className="text-2xl font-medium">{photo.location}</h2>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};