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

    /** Proxied Immich thumbnail/preview for a photo asset. */
    assetThumbnail(assetId: string): string {
        return `${this.apiBaseUrl}/api/v1/assets/${assetId}/thumbnail?size=preview`;
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
