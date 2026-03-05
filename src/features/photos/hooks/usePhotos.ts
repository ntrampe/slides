import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useServices } from "../../../shared/context/ServiceContext";
import { AuthError, ClientError, NetworkError } from "../../../shared/errors";
import type { PhotoFilterParams } from "../types";

interface UsePhotosParams extends PhotoFilterParams {
    page?: number;
    pageSize?: number;
}

export function usePhotos(params: UsePhotosParams = {}) {
    const { photos: photoRepo } = useServices();
    const { albumIds, personIds, location, startDate, endDate, page = 1, pageSize = 100 } = params;

    return useQuery({
        queryKey: ['photos', { albumIds, personIds, location, startDate, endDate, page, pageSize }],
        queryFn: () => photoRepo.getPhotos({ albumIds, personIds, location, startDate, endDate, page, pageSize }),
        refetchInterval: 60 * 60 * 1000,
    });
}

// Hook for infinite scrolling/loading more photos
export function useInfinitePhotos(params: Omit<UsePhotosParams, 'page'> = {}) {
    const { photos: photoRepo } = useServices();
    const { albumIds, personIds, location, startDate, endDate, pageSize = 100 } = params;

    return useInfiniteQuery({
        queryKey: ['photos', 'infinite', { albumIds, personIds, location, startDate, endDate, pageSize }],
        queryFn: ({ pageParam = 1 }) =>
            photoRepo.getPhotos({ albumIds, personIds, location, startDate, endDate, page: pageParam, pageSize }),
        getNextPageParam: (lastPage) =>
            lastPage.hasMore ? lastPage.page + 1 : undefined,
        initialPageParam: 1,
        refetchInterval: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount: number, error: Error) => {
            // Don't retry certain errors
            if (error instanceof NetworkError) return false;
            if (error instanceof AuthError) return false;
            if (error instanceof ClientError) return false;

            // Retry server errors (max 2 times)
            return failureCount < 2;
        },
        retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 3000),
    });
}