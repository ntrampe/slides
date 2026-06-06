/**
 * Merges a partial settings update into existing persisted overrides.
 * A property set to `null` removes that key (reverting to env defaults on read).
 */
export function applyPartialSettingsUpdate<T extends Record<string, unknown>>(
    existing: T | null | undefined,
    update: Partial<{ [K in keyof T]: T[K] | null }>
): T {
    const result = { ...(existing ?? {}) } as T;

    for (const [key, value] of Object.entries(update)) {
        if (value === null) {
            delete result[key as keyof T];
        } else {
            (result as Record<string, unknown>)[key] = value;
        }
    }

    return result;
}
