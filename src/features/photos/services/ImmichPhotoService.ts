import type { PhotoService, PaginationParams, PaginatedPhotos } from "../types";

export class ImmichPhotoService implements PhotoService {
    private proxyUrl = '/immich';

    async getPhotos(params: PaginationParams = {}): Promise<PaginatedPhotos> {
        console.log('[ImmichPhotoService] getPhotos called with params:', params);

        const { page = 1, pageSize = 100, albumId, personId } = params;
        const skip = (page - 1) * pageSize;

        console.log('[ImmichPhotoService] Pagination calculated - page:', page, 'pageSize:', pageSize, 'skip:', skip);

        try {
            // Build search metadata request body
            const searchBody: any = {
                size: pageSize,
                page: page,
            };

            // Add filters if provided
            if (albumId) {
                searchBody.albumIds = [albumId];
            }
            if (personId) {
                searchBody.personIds = [personId];
            }

            console.log('[ImmichPhotoService] Search body:', searchBody);

            // POST to search/metadata endpoint
            const searchUrl = `${this.proxyUrl}/api/search/metadata`;
            console.log('[ImmichPhotoService] Fetching from URL:', searchUrl);

            const searchRes = await fetch(searchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchBody),
            });

            if (!searchRes.ok) {
                const errorText = await searchRes.text();
                throw new Error(`Failed to search assets: ${searchRes.status} ${searchRes.statusText} - ${errorText}`);
            }

            const searchResult = await searchRes.json();
            console.log('[ImmichPhotoService] Search result:', searchResult);

            const assets = searchResult.assets?.items || [];
            const total = searchResult.assets?.total || 0;

            console.log('[ImmichPhotoService] Received assets - count:', assets.length, 'total:', total);

            const photos = assets.map((asset: any) => ({
                id: asset.id,
                url: `${this.proxyUrl}/api/assets/${asset.id}/original`,
                location: asset.exifInfo?.city || asset.exifInfo?.state || 'Unknown',
                createdAt: new Date(asset.fileCreatedAt || asset.createdAt),
                description: asset.exifInfo?.description,
            }));

            const hasMore = true; //skip + assets.length < total;
            console.log('[ImmichPhotoService] Processed photos - count:', photos.length, 'hasMore:', hasMore);

            const result = {
                photos,
                total,
                page,
                pageSize,
                hasMore,
            };

            console.log('[ImmichPhotoService] Returning result:', {
                photoCount: result.photos.length,
                total: result.total,
                page: result.page,
                pageSize: result.pageSize,
                hasMore: result.hasMore
            });

            return result;
        } catch (error) {
            console.error('[ImmichPhotoService] Error fetching photos:', error);
            throw error;
        }
    }
}