import { useQuery } from '@tanstack/react-query';
import { useServices } from '../../../shared/context/ServiceContext';

export const useLocationHierarchy = () => {
    const { locations: locationRepo } = useServices();

    return useQuery({
        queryKey: ['location-hierarchy'],
        queryFn: () => locationRepo.getLocationHierarchy(),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};