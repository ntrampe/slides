import {
    settingsUrlSchemas,
    type ConfigurationSettings,
    type PlaybackSettings,
    type QuerySettings,
    type UrlQueryOverrides,
} from '@slides/api-contract';
import qs from 'qs';
import {
    MOCK_ALBUMS,
    MOCK_LOCATION_HIERARCHY,
    MOCK_MAP_MARKERS,
    MOCK_PEOPLE,
} from './fixtures/catalogFixtures.js';
import { MOCK_SLIDESHOW_PHOTOS } from './fixtures/slideshowFixtures.js';
import {
    clearDomainOverrides,
    clearSettingsOverrides,
    getEffectiveMockSettings,
    saveDomainOverrides,
} from './settingsStorage.js';

const API_PREFIX = '/api/v1';

function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

function parseApiPath(url: string): { pathname: string; search: string } | null {
    try {
        const parsed = new URL(url, window.location.origin);
        if (!parsed.pathname.startsWith(API_PREFIX)) {
            return null;
        }
        return {
            pathname: parsed.pathname.slice(API_PREFIX.length) || '/',
            search: parsed.search,
        };
    } catch {
        return null;
    }
}

const QS_PARSE_OPTIONS = { allowPrototypes: true, allowSparse: true } as const;

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function parseBracketSearch(search: string): UrlQueryOverrides {
    const raw = search.startsWith('?') ? search.slice(1) : search;
    if (!raw) return {};

    const parsed = qs.parse(raw, QS_PARSE_OPTIONS) as Record<string, unknown>;
    const overrides: UrlQueryOverrides = {};

    if (isPlainObject(parsed.query)) {
        const result = settingsUrlSchemas.query.safeParse(parsed.query);
        if (result.success && Object.keys(result.data).length > 0) {
            overrides.query = result.data;
        }
    }

    if (isPlainObject(parsed.playback)) {
        const result = settingsUrlSchemas.playback.safeParse(parsed.playback);
        if (result.success && Object.keys(result.data).length > 0) {
            overrides.playback = result.data;
        }
    }

    if (isPlainObject(parsed.configuration)) {
        const result = settingsUrlSchemas.configuration.safeParse(parsed.configuration);
        if (result.success && Object.keys(result.data).length > 0) {
            overrides.configuration = result.data;
        }
    }

    return overrides;
}

async function readJsonBody(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<unknown> {
    const body =
        init?.body ?? (typeof input === 'object' && 'body' in input ? input.body : null);
    const text = typeof body === 'string' ? body : body ? await new Response(body).text() : '{}';
    return JSON.parse(text);
}

export async function handleMockFetch(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<Response | null> {
    const url =
        typeof input === 'string'
            ? input
            : input instanceof URL
              ? input.href
              : input.url;
    const method =
        init?.method ??
        (typeof input === 'object' && 'method' in input ? input.method : 'GET');

    const api = parseApiPath(url);
    if (!api) {
        return null;
    }

    const { pathname, search } = api;

    if (pathname === '/slideshow/query' && method === 'POST') {
        return jsonResponse({
            photos: MOCK_SLIDESHOW_PHOTOS,
            total: MOCK_SLIDESHOW_PHOTOS.length,
        });
    }

    if (pathname === '/settings' && method === 'GET') {
        const urlOverrides = parseBracketSearch(search);
        return jsonResponse(getEffectiveMockSettings(urlOverrides));
    }

    if (pathname === '/settings' && method === 'DELETE') {
        clearSettingsOverrides();
        return jsonResponse({ message: 'Settings overrides cleared' });
    }

    if (pathname === '/settings/query' && method === 'PATCH') {
        const body = (await readJsonBody(input, init)) as Partial<QuerySettings>;
        saveDomainOverrides('query', body);
        return jsonResponse(getEffectiveMockSettings());
    }

    if (pathname === '/settings/query' && method === 'DELETE') {
        clearDomainOverrides('query');
        return jsonResponse({ message: 'Query settings overrides cleared' });
    }

    if (pathname === '/settings/playback' && method === 'PATCH') {
        const body = (await readJsonBody(input, init)) as Partial<PlaybackSettings>;
        saveDomainOverrides('playback', body);
        return jsonResponse(getEffectiveMockSettings());
    }

    if (pathname === '/settings/playback' && method === 'DELETE') {
        clearDomainOverrides('playback');
        return jsonResponse({ message: 'Playback settings overrides cleared' });
    }

    if (pathname === '/settings/configuration' && method === 'PATCH') {
        const body = (await readJsonBody(input, init)) as Partial<ConfigurationSettings>;
        saveDomainOverrides('configuration', body);
        return jsonResponse(getEffectiveMockSettings());
    }

    if (pathname === '/settings/configuration' && method === 'DELETE') {
        clearDomainOverrides('configuration');
        return jsonResponse({ message: 'Configuration settings overrides cleared' });
    }

    if (pathname === '/albums' && method === 'GET') {
        return jsonResponse({ albums: MOCK_ALBUMS });
    }

    if (pathname === '/people' && method === 'GET') {
        return jsonResponse({ people: MOCK_PEOPLE });
    }

    if (pathname === '/locations' && method === 'GET') {
        return jsonResponse(MOCK_LOCATION_HIERARCHY);
    }

    if (pathname === '/locations/markers' && method === 'GET') {
        return jsonResponse({ markers: MOCK_MAP_MARKERS });
    }

    if (pathname.startsWith('/locations/resolve') && method === 'GET') {
        const parsed = new URL(url, window.location.origin);
        const country = parsed.searchParams.get('country') ?? undefined;
        const state = parsed.searchParams.get('state') ?? undefined;
        const city = parsed.searchParams.get('city') ?? undefined;
        if (!country && !state && !city) {
            return jsonResponse(null);
        }
        return jsonResponse({ country, state, city });
    }

    if (pathname === '/weather' && method === 'GET') {
        return jsonResponse({ temp: 22, condition: 'sunny', city: 'Demo City' });
    }

    return jsonResponse(
        { error: { message: `Mock handler not found: ${method} ${pathname}` } },
        404
    );
}
