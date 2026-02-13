import { useQuery } from "@tanstack/react-query";
import { useServices } from "../../../shared/context/ServiceContext";

export function usePhotos(albumId?: string) {
    const { photos: photoService } = useServices();

    return useQuery({
        queryKey: ['photos', albumId],
        // Wrap the service call in an anonymous function 
        // This ignores the TanStack context and passes what YOUR service needs
        queryFn: () => photoService.getPhotos({ albumId }),
        refetchInterval: 60 * 60 * 1000,
    });
}