import { Router } from 'express';
import type { CatalogService } from '../../../services/CatalogService.js';
import type { ImmichClient } from '../../../infra/ImmichClient.js';
import type { ServerConfig } from '../../../config.js';
import { createLinkBuilder } from '../../../infra/LinkBuilder.js';
import { streamToResponse } from '../../middleware/streamToResponse.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import {
    toAlbumDto,
    toLocationHierarchyDto,
    toLocationSelectionDto,
    toMapMarkerDto,
    toPersonDto,
} from '../../mappers/index.js';

export function createCatalogRouters(
    service: CatalogService,
    immich: ImmichClient,
    config: ServerConfig
): { albums: Router; people: Router; locations: Router } {
    const albums = Router();
    albums.get(
        '/',
        asyncHandler(async (req, res) => {
            const items = await service.getAlbums(createLinkBuilder(req, config));
            res.json({ albums: items.map(toAlbumDto) });
        })
    );

    const people = Router();
    people.get(
        '/',
        asyncHandler(async (req, res) => {
            const items = await service.getPeople(createLinkBuilder(req, config));
            res.json({ people: items.map(toPersonDto) });
        })
    );
    people.get(
        '/:id/thumbnail',
        asyncHandler(async (req, res) => {
            const asset = await immich.fetchAsset(
                `/api/people/${req.params.id}/thumbnail`,
                req.headers.range
            );
            streamToResponse(asset, res);
        })
    );

    const locations = Router();
    locations.get(
        '/',
        asyncHandler(async (_req, res) => {
            res.json(toLocationHierarchyDto(await service.getLocationHierarchy()));
        })
    );
    locations.get(
        '/markers',
        asyncHandler(async (_req, res) => {
            const markers = await service.getMapMarkers();
            res.json({ markers: markers.map(toMapMarkerDto) });
        })
    );
    locations.get(
        '/resolve',
        asyncHandler(async (req, res) => {
            const { country, state, city } = req.query;
            const resolved = await service.resolveLocation({
                country: asString(country),
                state: asString(state),
                city: asString(city),
            });
            res.json(resolved ? toLocationSelectionDto(resolved) : null);
        })
    );

    return { albums, people, locations };
}

function asString(value: unknown): string | undefined {
    return typeof value === 'string' && value.length > 0 ? value : undefined;
}
