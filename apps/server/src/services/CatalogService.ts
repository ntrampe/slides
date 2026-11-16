import type { ImmichClient } from '../infra/ImmichClient.js';
import type { LinkBuilder } from '../infra/LinkBuilder.js';
import type { DomainAlbum } from '../domain/albums.js';
import type { DomainPerson } from '../domain/people.js';
import type {
    DomainLocationHierarchy,
    DomainLocationSelection,
    DomainMapMarker,
} from '../domain/locations.js';
import { buildLocationHierarchy } from '../domain/buildLocationHierarchy.js';
import type { ImmichAlbumOrder } from '../domain/sortPhotos.js';

interface ImmichAlbum {
    id: string;
    albumName: string;
    description?: string;
    albumThumbnailAssetId?: string;
    assetCount?: number;
    createdAt: string;
    updatedAt: string;
    shared?: boolean;
    /** Album display order set in Immich (newest-first is Immich's default). */
    order?: ImmichAlbumOrder;
}

interface ImmichMapMarker {
    id: string;
    lat: number;
    lon: number;
    city: string;
    state: string;
    country: string;
}

interface ImmichPerson {
    id: string;
    name: string;
    birthDate?: string | null;
    isHidden: boolean;
    isFavorite: boolean;
    updatedAt: string;
}

export class CatalogService {
    constructor(private readonly immich: ImmichClient) {}

    async getAlbums(links: LinkBuilder): Promise<DomainAlbum[]> {
        const albums = await this.immich.get<ImmichAlbum[]>('/api/albums');

        return albums.map((album) => ({
            id: album.id,
            name: album.albumName,
            description: album.description ?? null,
            thumbnailUrl: album.albumThumbnailAssetId
                ? links.assetThumbnail(album.albumThumbnailAssetId)
                : '',
            assetCount: album.assetCount ?? 0,
            createdAt: album.createdAt,
            updatedAt: album.updatedAt,
            shared: album.shared ?? false,
        }));
    }

    /**
     * Display orders for the given album IDs, as configured in Immich. Albums that
     * are not found are skipped; albums without an explicit order use Immich's
     * default (`desc`).
     */
    async getAlbumOrders(albumIds: string[]): Promise<ImmichAlbumOrder[]> {
        if (albumIds.length === 0) return [];
        const wanted = new Set(albumIds);
        const albums = await this.immich.get<ImmichAlbum[]>('/api/albums');
        return albums
            .filter((album) => wanted.has(album.id))
            .map((album) => album.order ?? 'desc');
    }

    async getPeople(links: LinkBuilder): Promise<DomainPerson[]> {
        const json = await this.immich.get<{ people?: ImmichPerson[] }>('/api/people');
        const people = json.people ?? [];

        return people.map((person) => ({
            id: person.id,
            name: person.name,
            birthDate: person.birthDate ?? null,
            thumbnailUrl: links.personThumbnail(person.id),
            isHidden: person.isHidden,
            isFavorite: person.isFavorite,
            updatedAt: person.updatedAt,
        }));
    }

    async getMapMarkers(): Promise<DomainMapMarker[]> {
        const markers = await this.immich.get<ImmichMapMarker[]>('/api/map/markers');
        return markers.map((m) => ({
            id: m.id,
            lat: m.lat,
            lon: m.lon,
            city: m.city,
            state: m.state,
            country: m.country,
        }));
    }

    async getLocationHierarchy(): Promise<DomainLocationHierarchy> {
        const markers = await this.getMapMarkers();
        return buildLocationHierarchy(markers);
    }

    async resolveLocation(
        partial: Partial<DomainLocationSelection>
    ): Promise<DomainLocationSelection | null> {
        const markers = await this.getMapMarkers();

        const match = markers.find((marker) => {
            if (partial.city && marker.city !== partial.city) return false;
            if (partial.state && marker.state !== partial.state) return false;
            if (partial.country && marker.country !== partial.country) return false;
            return true;
        });

        if (!match) return null;

        return { country: match.country, state: match.state, city: match.city };
    }
}
