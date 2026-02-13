import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useServices } from "../../../shared/context/ServiceContext";

interface UsePhotosParams {
    albumId?: string;
    personId?: string;
    page?: number;
    pageSize?: number;
}

export function usePhotos(params: UsePhotosParams = {}) {
    const { photos: photoService } = useServices();
    const { albumId, personId, page = 1, pageSize = 100 } = params;

    return useQuery({
        queryKey: ['photos', { albumId, personId, page, pageSize }],
        queryFn: () => photoService.getPhotos({ albumId, personId, page, pageSize }),
        refetchInterval: 60 * 60 * 1000,
    });
}

// Hook for infinite scrolling/loading more photos
export function useInfinitePhotos(params: Omit<UsePhotosParams, 'page'> = {}) {
    const { photos: photoService } = useServices();
    const { albumId, personId, pageSize = 100 } = params;

    return useInfiniteQuery({
        queryKey: ['photos', 'infinite', { albumId, personId, pageSize }],
        queryFn: ({ pageParam = 1 }) =>
            photoService.getPhotos({ albumId, personId, page: pageParam, pageSize }),
        getNextPageParam: (lastPage) =>
            lastPage.hasMore ? lastPage.page + 1 : undefined,
        initialPageParam: 1,
        refetchInterval: 60 * 60 * 1000,
    });
}