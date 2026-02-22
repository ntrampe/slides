import type { AppSettings } from '../types';
import { deepMerge, type DeepPartial } from '../../../shared/utils/deepMerge';

/**
 * Parses URL query params using dot-notation paths that match AppSettings.
 * Example:
 *   ?photos.display.animation.type=ken-burns
 */
export function parseUrlSettings(
    search: string,
    base: AppSettings
): DeepPartial<AppSettings> {
    const params = new URLSearchParams(search);

    let accumulated: DeepPartial<AppSettings> = {};

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
    let current: any = base;

    // Walk as far as schema exists
    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];

        if (!current || typeof current !== 'object') {
            break;
        }

        if (!(key in current)) {
            return null; // invalid branch
        }

        current = current[key];
    }

    const finalKey = path[path.length - 1];

    let exampleValue: unknown = undefined;

    if (current && typeof current === 'object' && finalKey in current) {
        exampleValue = current[finalKey];
    }

    const parsed =
        exampleValue !== undefined
            ? parseValue(rawValue, exampleValue)
            : rawValue;

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
        .reduce((acc, key) => ({ [key]: acc }), value);
}