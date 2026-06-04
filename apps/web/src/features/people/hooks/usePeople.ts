import { useQuery } from '@tanstack/react-query';
import { fetchPeople } from '../../../api/catalog.js';

export function usePeople() {
    return useQuery({
        queryKey: ['people'],
        queryFn: fetchPeople,
    });
}
