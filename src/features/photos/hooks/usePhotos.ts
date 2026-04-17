import { useQuery } from "@tanstack/react-query";
import { useServices } from "../../../shared/context/ServiceContext";
import { AuthError, ClientError, NetworkError } from "../../../shared/errors";
import type { PhotoFilterParams } from "../types";

export type UsePhotosParams = PhotoFilterParams;

/**
 * Loads the full photo list for the given filters in one request (metadata search
 * is drained server-side in the repo). React Query refetches when filter fields change.
 */
export function usePhotos(params: UsePhotosParams = {}) {
    const { photos: photoRepo } = useServices();
    const {
        albumIds,
        excludeAlbumIds,
        albumOperator,
        personIds,
        excludePersonIds,
        personOperator,
        location,
        startDate,
        endDate,
        globalOperator,
    } = params;

    return useQuery({
        queryKey: [
            'photos',
            {
                albumIds,
                excludeAlbumIds,
                albumOperator,
                personIds,
                excludePersonIds,
                personOperator,
                location,
                startDate,
                endDate,
                globalOperator,
            },
        ],
        queryFn: () =>
            photoRepo.getPhotos({
                albumIds,
                excludeAlbumIds,
                albumOperator,
                personIds,
                excludePersonIds,
                personOperator,
                location,
                startDate,
                endDate,
                globalOperator,
            }),
        refetchInterval: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount: number, error: Error) => {
            if (error instanceof NetworkError) return false;
            if (error instanceof AuthError) return false;
            if (error instanceof ClientError) return false;
            return failureCount < 2;
        },
        retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 3000),
    });
}
