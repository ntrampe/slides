import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useServices } from "../../../shared/context/ServiceContext";
import type { SlideshowFilter } from '../../../shared/types/config';

interface UsePhotosParams extends SlideshowFilter {
    page?: number;
    pageSize?: number;
}

export function usePhotos(params: UsePhotosParams = {}) {
    const { photos: photoService } = useServices();
    const { albumIds, personIds, page = 1, pageSize = 100 } = params;

    return useQuery({
        queryKey: ['photos', { albumIds, personIds, page, pageSize }],
        queryFn: () => photoService.getPhotos({ albumIds, personIds, page, pageSize }),
        refetchInterval: 60 * 60 * 1000,
    });
}

// Hook for infinite scrolling/loading more photos
export function useInfinitePhotos(params: Omit<UsePhotosParams, 'page'> = {}) {
    const { photos: photoService } = useServices();
    const { albumIds, personIds, pageSize = 100 } = params;

    return useInfiniteQuery({
        queryKey: ['photos', 'infinite', { albumIds, personIds, pageSize }],
        queryFn: ({ pageParam = 1 }) =>
            photoService.getPhotos({ albumIds, personIds, page: pageParam, pageSize }),
        getNextPageParam: (lastPage) =>
            lastPage.hasMore ? lastPage.page + 1 : undefined,
        initialPageParam: 1,
        refetchInterval: 60 * 60 * 1000,
    });
}