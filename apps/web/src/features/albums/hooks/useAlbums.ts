import { useQuery } from '@tanstack/react-query';
import { fetchAlbums } from '../../../api/catalog.js';

export function useAlbums() {
    return useQuery({
        queryKey: ['albums'],
        queryFn: fetchAlbums,
    });
}
