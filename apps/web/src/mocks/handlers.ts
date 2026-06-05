import type { DisplaySettings, PlaybackSettings, QuerySettings } from '@slides/api-contract';
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

type MockUrlOverrides = {
    query?: Partial<QuerySettings>;
    playback?: Partial<PlaybackSettings>;
    display?: Partial<DisplaySettings>;
};

function parseBracketSearch(search: string): MockUrlOverrides {
    const qs = search.startsWith('?') ? search.slice(1) : search;
    if (!qs) return {};

    const params = new URLSearchParams(qs);
    const overrides: MockUrlOverrides = {};

    for (const [key, raw] of params.entries()) {
        const match = key.match(/^(query|playback|display)\[(\w+)\]$/);
        if (!match) continue;

        const domain = match[1] as keyof MockUrlOverrides;
        const field = match[2];
        const bucket: Record<string, unknown> = { ...(overrides[domain] as object) };

        if (raw === 'true' || raw === 'false') {
            bucket[field] = raw === 'true';
        } else if (raw.includes(',')) {
            bucket[field] = raw.split(',').map((s) => s.trim()).filter(Boolean);
        } else if (!Number.isNaN(Number(raw)) && raw.trim() !== '') {
            bucket[field] = Number(raw);
        } else {
            bucket[field] = raw;
        }

        overrides[domain] = bucket as MockUrlOverrides[typeof domain];
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
        const body = (await readJsonBody(input, init)) as QuerySettings;
        saveDomainOverrides('query', body);
        return jsonResponse(getEffectiveMockSettings());
    }

    if (pathname === '/settings/query' && method === 'DELETE') {
        clearDomainOverrides('query');
        return jsonResponse({ message: 'Query settings overrides cleared' });
    }

    if (pathname === '/settings/playback' && method === 'PATCH') {
        const body = (await readJsonBody(input, init)) as PlaybackSettings;
        saveDomainOverrides('playback', body);
        return jsonResponse(getEffectiveMockSettings());
    }

    if (pathname === '/settings/playback' && method === 'DELETE') {
        clearDomainOverrides('playback');
        return jsonResponse({ message: 'Playback settings overrides cleared' });
    }

    if (pathname === '/settings/display' && method === 'PATCH') {
        const body = (await readJsonBody(input, init)) as DisplaySettings;
        saveDomainOverrides('display', body);
        return jsonResponse(getEffectiveMockSettings());
    }

    if (pathname === '/settings/display' && method === 'DELETE') {
        clearDomainOverrides('display');
        return jsonResponse({ message: 'Display settings overrides cleared' });
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
        const effective = getEffectiveMockSettings(parseBracketSearch(search));
        if (!effective.display.showWeather) {
            return jsonResponse({ error: { message: 'Weather is not enabled' } }, 404);
        }
        return jsonResponse({ temp: 22, condition: 'sunny', city: 'Demo City' });
    }

    return jsonResponse(
        { error: { message: `Mock handler not found: ${method} ${pathname}` } },
        404
    );
}
