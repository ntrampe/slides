import type { QuerySettings } from '@slides/api-contract';

export type DatePreset = NonNullable<QuerySettings['datePreset']>;

const DATE_PRESETS: DatePreset[] = ['all', 'today', 'week', 'month', 'year', 'custom'];

/** Parse helpers for `DEFAULT_*` environment variables in server default settings. */

export function parseBool(value: string | undefined, fallback: boolean): boolean {
    if (!value) return fallback;
    return value.toLowerCase() === 'true';
}

export function parseNumber(value: string | undefined, fallback: number): number {
    if (!value) return fallback;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallback : parsed;
}

export function parseFloatEnv(value: string | undefined, fallback: number): number {
    if (!value) return fallback;
    const parsed = Number(value);
    return isNaN(parsed) ? fallback : parsed;
}

export function parseIdArray(value: string | undefined): string[] {
    if (!value) return [];
    return value.split(',').map((id) => id.trim()).filter(Boolean);
}

export function parseString(value: string | undefined): string | undefined {
    if (!value) return undefined;
    return value.trim() || undefined;
}

export function parseHourFormat(
    value: string | undefined,
    fallback: '12' | '24'
): '12' | '24' {
    if (value === '24') return '24';
    if (value === '12') return '12';
    return fallback;
}

export function parseDatePreset(value: string | undefined): DatePreset | undefined {
    if (!value) return undefined;
    const preset = value.trim() as DatePreset;
    return DATE_PRESETS.includes(preset) ? preset : undefined;
}
