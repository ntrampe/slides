import type { Photo, PhotoService } from "../types";


export class ImmichPhotoService implements PhotoService {
    private baseUrl: string;
    private apiKey: string;

    constructor(baseUrl: string, apiKey: string) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }

    async getPhotos(): Promise<Photo[]> {
        const res = await fetch(`${this.baseUrl}/api/asset`, {
            headers: { 'x-api-key': this.apiKey }
        });
        const data = await res.json();
        return data.map((item: any) => ({
            id: item.id,
            url: `${this.baseUrl}/api/asset/file/${item.id}`,
            location: item.exifInfo?.city || 'Unknown',
            createdAt: new Date(item.fileCreatedAt),
        }));
    }
}