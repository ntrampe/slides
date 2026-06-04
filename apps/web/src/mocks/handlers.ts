import type { AppSettings } from '@slides/api-contract';
import { FALLBACK_APP_SETTINGS } from '@slides/shared/constants';
import { deepMerge, type DeepPartial } from '@slides/shared/utils/deepMerge';
import {
    MOCK_ALBUMS,
    MOCK_LOCATION_HIERARCHY,
    MOCK_MAP_MARKERS,
    MOCK_PEOPLE,
} from './fixtures/catalogFixtures.js';
import { MOCK_SLIDESHOW_PHOTOS } from './fixtures/slideshowFixtures.js';
import {
    clearSettingsOverrides,
    loadSettingsOverrides,
    saveSettingsOverrides,
} from './settingsStorage.js';

const API_PREFIX = '/api/v1';

function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

function emptyResponse(status = 204): Response {
    return new Response(null, { status });
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

    const { pathname } = api;

    if (pathname === '/slideshow' && method === 'GET') {
        return jsonResponse({
            photos: MOCK_SLIDESHOW_PHOTOS,
            total: MOCK_SLIDESHOW_PHOTOS.length,
        });
    }

    if (pathname === '/settings/resolved' && method === 'GET') {
        const saved = loadSettingsOverrides();
        const settings = deepMerge(FALLBACK_APP_SETTINGS, saved ?? {});
        return jsonResponse(settings);
    }

    if (pathname === '/settings' && method === 'GET') {
        const saved = loadSettingsOverrides();
        return jsonResponse(saved ?? {});
    }

    if (pathname === '/settings' && method === 'PUT') {
        const body = init?.body ?? (typeof input === 'object' && 'body' in input ? input.body : null);
        const text = typeof body === 'string' ? body : body ? await new Response(body).text() : '{}';
        saveSettingsOverrides(JSON.parse(text) as DeepPartial<AppSettings>);
        return emptyResponse();
    }

    if (pathname === '/settings' && method === 'DELETE') {
        clearSettingsOverrides();
        return emptyResponse();
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
