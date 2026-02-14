import { useQuery } from '@tanstack/react-query';
import { useServices } from '../../../shared/context/ServiceContext';

export const useAlbums = () => {
    const { albums: albumRepo } = useServices();

    return useQuery({
        queryKey: ['albums'],
        queryFn: () => albumRepo.getAlbums(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
