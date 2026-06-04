import type { DomainAppSettings } from '../settings.js';
import { deepMerge, type DeepPartial } from '@slides/shared/utils/deepMerge';

/**
 * Parses URL query params using dot-notation paths that match DomainAppSettings.
 * Used server-side when resolving GET /api/v1/settings/resolved.
 */
export function parseUrlSettings(
    search: string,
    base: DomainAppSettings
): DeepPartial<DomainAppSettings> {
    const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);

    let accumulated: DeepPartial<DomainAppSettings> = {};

    for (const [key, value] of params.entries()) {
        const path = key.split('.');
        const result = resolvePath(base, path, value);

        if (result) {
            accumulated = deepMerge(accumulated, result);
        }
    }

    return accumulated;
}

function resolvePath<T extends object>(
    base: T,
    path: string[],
    rawValue: string
): DeepPartial<T> | null {
    let current: Record<string, unknown> = base as Record<string, unknown>;

    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];

        if (!current || typeof current !== 'object') {
            break;
        }

        if (!(key in current)) {
            return null;
        }

        current = current[key] as Record<string, unknown>;
    }

    const finalKey = path[path.length - 1];

    let exampleValue: unknown = undefined;

    if (current && typeof current === 'object' && finalKey in current) {
        exampleValue = current[finalKey];
    }

    const parsed =
        exampleValue !== undefined ? parseValue(rawValue, exampleValue) : rawValue;

    if (parsed === undefined) return null;

    return buildNestedObject(path, parsed) as DeepPartial<T>;
}

function parseValue(raw: string, example: unknown): unknown {
    if (Array.isArray(example)) {
        if (raw === '') return [];
        return raw.split(',').filter(Boolean);
    }

    if (typeof example === 'boolean') {
        if (raw === 'true') return true;
        if (raw === 'false') return false;
        return undefined;
    }

    if (typeof example === 'number') {
        const num = Number(raw);
        return Number.isFinite(num) ? num : undefined;
    }

    if (typeof example === 'string') {
        return raw;
    }

    return undefined;
}

function buildNestedObject(path: string[], value: unknown) {
    return path
        .slice()
        .reverse()
        .reduce<Record<string, unknown>>((acc, key) => ({ [key]: acc }), value as Record<string, unknown>);
}
