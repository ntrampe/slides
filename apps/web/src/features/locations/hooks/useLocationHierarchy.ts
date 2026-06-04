import { useQuery } from '@tanstack/react-query';
import { fetchLocationHierarchy } from '../../../api/catalog.js';

export function useLocationHierarchy() {
    return useQuery({
        queryKey: ['locations'],
        queryFn: fetchLocationHierarchy,
    });
}
