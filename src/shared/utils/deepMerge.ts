/**
 * Recursively makes all properties optional, for partial updates.
 */
export type DeepPartial<T> = T extends object
    ? { [P in keyof T]?: DeepPartial<T[P]> }
    : T;

/**
 * Deep merge utility that recursively merges source into target.
 * Only merges plain objects, not arrays (arrays are replaced).
 * 
 * @param target - Base object to merge into
 * @param source - Partial object with updates
 * @returns New merged object (does not mutate inputs)
 */
export function deepMerge<T extends Record<string, any>>(
    target: T,
    source: DeepPartial<T>
): T {
    const output = { ...target } as T;

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const sourceValue = source[key];
            const targetValue = target[key as keyof T];

            if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
                // Recursively merge nested objects
                (output as any)[key] = deepMerge(
                    targetValue as Record<string, any>,
                    sourceValue as any
                );
            } else if (sourceValue !== undefined) {
                // Replace primitives, arrays, or undefined target values
                (output as any)[key] = sourceValue;
            }
        }
    }

    return output;
}

/**
 * Check if value is a plain object (not array, null, Date, etc)
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
