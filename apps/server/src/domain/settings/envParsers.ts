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
