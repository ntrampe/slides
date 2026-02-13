import type { Photo, PhotoService, PaginationParams, PaginatedPhotos } from "../types";


export class ImmichPhotoService implements PhotoService {
    private baseUrl: string;
    private apiKey: string;

    constructor(baseUrl: string, apiKey: string) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }

    async getPhotos(params: PaginationParams = {}): Promise<PaginatedPhotos> {
        const { page = 1, pageSize = 100 } = params;

        // Immich API supports pagination via skip and take parameters
        const skip = (page - 1) * pageSize;
        const url = new URL(`${this.baseUrl}/api/asset`);
        url.searchParams.append('skip', skip.toString());
        url.searchParams.append('take', pageSize.toString());

        const res = await fetch(url.toString(), {
            headers: { 'x-api-key': this.apiKey }
        });
        const data = await res.json();

        const photos = data.map((item: any) => ({
            id: item.id,
            url: `${this.baseUrl}/api/asset/file/${item.id}`,
            location: item.exifInfo?.city || 'Unknown',
            createdAt: new Date(item.fileCreatedAt),
        }));

        // Note: Immich might not return total count in the standard asset endpoint
        // You may need to make a separate call to get the total count
        // For now, we'll estimate based on the response
        const hasMore = data.length === pageSize;

        return {
            photos,
            total: hasMore ? skip + pageSize + 1 : skip + photos.length, // Estimated
            page,
            pageSize,
            hasMore,
        };
    }
}