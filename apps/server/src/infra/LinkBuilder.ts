import type { Request } from 'express';
import type { ServerConfig } from '../config.js';
import { resolveBaseUrl } from '../http/middleware/baseUrl.js';

/**
 * The public-facing Immich URL used for deep-links into the Immich web UI.
 * Defaults to `IMMICH_URL`; override with `IMMICH_PUBLIC_URL` when Immich is
 * reachable externally at a different address than the internal API URL.
 */
export function immichAppBaseUrl(config: ServerConfig): string {
    return (config.IMMICH_PUBLIC_URL ?? config.IMMICH_URL).replace(/\/$/, '');
}

/**
 * Owns the API's public URL scheme. Services express intent ("the thumbnail for
 * this asset") and the LinkBuilder turns it into an absolute URL. This keeps URL
 * structure and request-derived base URLs out of the service layer, so services
 * stay transport-agnostic and testable.
 */
export class LinkBuilder {
    constructor(
        private readonly apiBaseUrl: string,
        private readonly immichAppUrl: string
    ) {}

    /**
     * Proxied Immich preview for a photo asset.
     *
     * `edited=true` asks Immich for the edited rendition (crop/rotate/mirror)
     * when one exists, falling back to the original otherwise. Immich only
     * serves edits by default to shared-link viewers, so API-key callers must
     * opt in explicitly.
     *
     * `cacheKey` (the asset's thumbhash) is appended as `c`, mirroring Immich's
     * own web client: the thumbhash changes whenever the asset is re-edited,
     * which busts browser caches that would otherwise serve the stale image.
     */
    assetThumbnail(assetId: string, cacheKey?: string): string {
        const params = new URLSearchParams({ size: 'preview', edited: 'true' });
        if (cacheKey) params.set('c', cacheKey);
        return `${this.apiBaseUrl}/api/v1/assets/${assetId}/thumbnail?${params}`;
    }

    /** Proxied Immich video (used for live photos). */
    assetVideo(assetId: string): string {
        return `${this.apiBaseUrl}/api/v1/assets/${assetId}/video`;
    }

    /** Proxied Immich thumbnail for a person. */
    personThumbnail(personId: string): string {
        return `${this.apiBaseUrl}/api/v1/people/${personId}/thumbnail`;
    }

    /** Deep-link into the Immich web UI for an asset. */
    immichDeepLink(assetId: string): string {
        return `${this.immichAppUrl}/photos/${assetId}`;
    }
}

/** Builds a per-request LinkBuilder from the resolved API base URL and config. */
export function createLinkBuilder(req: Request, config: ServerConfig): LinkBuilder {
    return new LinkBuilder(resolveBaseUrl(req, config), immichAppBaseUrl(config));
}
